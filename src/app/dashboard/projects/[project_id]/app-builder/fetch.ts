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
    screenshots?: string[]; // <-- Added this line
  };
  project: {
    id: number;
    name: string;
    description: string | null;
  };
};

export async function fetchAppBuilderData(
  projectId: string
): ResponseJson<FetchAppBuilderData & { updateType?: string; aboutDesc?: string }> {
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
    const combinedData: FetchAppBuilderData & { updateType?: string } = {
      appId: appData.data.appId,
      isNewApp: appData.data.isNewApp,
      status: appData.data.status,
      project: {
        id: projectData.data.project.id,
        name: projectData.data.project.name,
        description: projectData.data.project.description,
      },
      // Add app details directly from appData if available
      app: appData.data.app ? {
        id: appData.data.app.id,
        subtitle: appData.data.app.subtitle,
        type: appData.data.app.type,
        aboutDesc: appData.data.app.aboutDesc,
        content: appData.data.app.content,
        webUrl: appData.data.app.webUrl,
        appFile: appData.data.app.appFile,
        cardImage: appData.data.app.cardImage,
        bannerImage: appData.data.app.bannerImage,
        featuredPriority: appData.data.app.featuredPriority,
        status: appData.data.app.status,
        updateType: appData.data.app.updateType,
      } : undefined
    };

    // If we have an app ID and it's not a new app and status is 'accepted', try to get the public details
    if (appData.data.appId && !appData.data.isNewApp && (appData.data.status === 'accepted')) {
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

export async function saveAppDraft({ appId, subtitle, aboutDesc, type, webUrl, updateType }: { appId: number, subtitle: string, aboutDesc: string, type?: number, webUrl?: string, updateType: string }) {
  try {
    const sessionId = await getSessionCookie();
    if (!sessionId) {
      return { success: false, message: 'Unauthorized: No session' };
    }
    const res = await fetch(`${await getBaseUrl()}/api/internal/app/${appId}/edit`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionId}`,
      },
      body: JSON.stringify({
        subtitle,
        aboutDesc,
        type,
        webUrl,
        updateType,
        status: 'draft',
      }),
      cache: 'no-cache',
    });
    const data = await res.json();
    return data;
  } catch (err) {
    return { success: false, message: 'Failed to save draft.' };
  }
} 