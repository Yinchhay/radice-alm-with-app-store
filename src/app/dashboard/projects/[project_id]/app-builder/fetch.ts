"use server";
import { ResponseJson, returnFetchErrorSomethingWentWrong } from "@/lib/response";
import { getBaseUrl, getSessionCookie } from "@/lib/server_utils";
import { FetchOneAssociatedProjectData } from "@/app/api/internal/project/[project_id]/route";

export type FetchAppBuilderData = {
  appId?: number;
  isNewApp: boolean;
  status: string;
  app?: {
    id: number;
    subtitle: string | null;
    type: number | null;
    aboutDesc: string | null;
    content: string | null;
    webUrl: string | null;
    appFile: string | null;
    cardImage: string | null;
    bannerImage: string | null;
    featuredPriority: number | null;
    status: string;
  };
  project: {
    id: number;
    name: string;
    description: string | null;
  };
};

export async function fetchAppBuilderData(
  projectId: string
): ResponseJson<FetchAppBuilderData> {
  try {
    const sessionId = await getSessionCookie();
    
    // First, get project data
    const projectResponse = await fetch(
      `${await getBaseUrl()}/api/internal/project/${projectId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${sessionId}`,
        },
        cache: "no-cache",
      }
    );
    
    const projectData = await projectResponse.json();
    
    if (!projectData.success) {
      return projectData;
    }

    // Then, try to get or create app data
    const appResponse = await fetch(
      `${await getBaseUrl()}/api/internal/project/${projectId}/app`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionId}`,
        },
        cache: "no-cache",
      }
    );
    
    const appData = await appResponse.json();
    
    if (!appData.success) {
      return appData;
    }

    // Combine the data
    const combinedData: FetchAppBuilderData = {
      appId: appData.data.appId,
      isNewApp: appData.data.isNewApp,
      status: appData.data.status,
      project: {
        id: projectData.data.project.id,
        name: projectData.data.project.name,
        description: projectData.data.project.description,
      }
    };

    // If we have an app ID and it's not a new app, try to get the app details
    if (appData.data.appId && !appData.data.isNewApp) {
      try {
        const appDetailsResponse = await fetch(
          `${await getBaseUrl()}/api/public/app/${appData.data.appId}`,
          {
            method: "GET",
            cache: "no-cache",
          }
        );
        
        const appDetails = await appDetailsResponse.json();
        
        if (appDetails.success && appDetails.data.app) {
          combinedData.app = {
            id: appDetails.data.app.id,
            subtitle: appDetails.data.app.subtitle,
            type: null, // We'll need to map this from appType if available
            aboutDesc: appDetails.data.app.aboutDesc,
            content: appDetails.data.app.content,
            webUrl: appDetails.data.app.webUrl,
            appFile: appDetails.data.app.appFile,
            cardImage: appDetails.data.app.cardImage,
            bannerImage: appDetails.data.app.bannerImage,
            featuredPriority: null, // We'll need to map this from priority if available
            status: appDetails.data.app.status || 'draft',
          };
        }
      } catch (error) {
        console.error('Error fetching app details:', error);
        // Continue without app details
      }
    }

    return {
      success: true,
      message: "App builder data retrieved successfully",
      data: combinedData,
    };
  } catch (error: any) {
    return returnFetchErrorSomethingWentWrong(error);
  }
} 