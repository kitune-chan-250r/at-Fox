import { ReactNode, createContext, useMemo, useState } from "react";
import { Response as ProfileResponse } from "@atproto/api/dist/client/types/app/bsky/actor/getProfile";
import BskyClient from "../utils/BskyClient";

export type UpdateMyProfile = () => Promise<void>;

interface MyProfileContextInterface {
    myProfile: ProfileResponse;
    updateMyProfile: UpdateMyProfile;
}

export const MyProfileContext = createContext({} as MyProfileContextInterface);

export const MyProfileProvider = ({
    children,
}: {
    children: ReactNode;
}): JSX.Element => {
    const [myProfile, setMyProfile] = useState({} as ProfileResponse);
    const client = BskyClient.getInstance();

    const updateMyProfile = async () => {
        const session = client.getSession();
        if (session === undefined) throw new Error("session undefined");

        client
            .getMyAvatar(session.handle)
            .then((profile) => {
                setMyProfile(profile);
            })
            .catch((e) => {
                console.error(e);
                setMyProfile({} as ProfileResponse);
            });
    };

    const provider = useMemo(
        (): MyProfileContextInterface => ({
            myProfile,
            updateMyProfile,
        }),
        [myProfile]
    );

    return (
        <MyProfileContext.Provider value={provider}>
            {children}
        </MyProfileContext.Provider>
    );
};
