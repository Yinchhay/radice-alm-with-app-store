import Image from "next/image";

export interface MemberProfileType {
    firstName: string;
    lastName: string;
    profileURL: string;
    email: string;
    description: string;
}

export default function MemberProfile({
    member,
    variant,
}: {
    member: MemberProfileType;
    variant: string;
}) {
    switch (variant) {
        case "light":
            return (
                <div className="flex flex-col items-center w-[400px]">
                    <div className="w-[180px] h-[220px] relative">
                        <Image
                            src={
                                member.profileURL
                                    ? member.profileURL
                                    : "/wrath.jpg"
                            }
                            fill
                            className="object-cover"
                            alt=""
                        />
                    </div>
                    <h1 className="font-bold text-xl mt-2">
                        {member.firstName + " " + member.lastName}
                    </h1>
                    <h2 className="font-bold">{member.email}</h2>
                    <p className="text-sm text-center text-gray-800">
                        {member.description}
                    </p>
                </div>
            );
        case "dark":
            return (
                <div className="flex flex-col items-center w-[400px]">
                    <div className="w-[180px] h-[220px] relative">
                        <Image
                            src={member.profileURL}
                            fill
                            className="object-cover"
                            alt=""
                        />
                    </div>
                    <h1 className="font-bold text-xl mt-2">
                        {member.firstName + " " + member.lastName}
                    </h1>
                    <h2 className="font-bold">{member.email}</h2>
                    <p className="text-sm text-center text-gray-300">
                        {member.description}
                    </p>
                </div>
            );
    }
}
