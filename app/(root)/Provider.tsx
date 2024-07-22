"use client";

import Loader from "@/components/Loader";
import { getClerkUser, getDocumentUsers } from "@/lib/actions/user.action";
import { useUser } from "@clerk/nextjs";
import { LiveblocksProvider, ClientSideSuspense } from "@liveblocks/react/suspense";
import { ReactNode } from "react";

const Provider = ({ children }: { children: ReactNode }) => {
	const {user: clerkUser} = useUser();
	return (
		<LiveblocksProvider
			authEndpoint="/api/liveblocks-auth"
			resolveUsers={async (userIds) => {
				const users = await getClerkUser(userIds);

        return users;
			}}
			resolveMentionSuggestions={async ({text, roomId}) => {
				const roomUsers = await getDocumentUsers({
					roomId,
					currentUser: clerkUser?.emailAddresses[0].emailAddress!,
					text
				});

				return roomUsers;
			}}
		>
			<ClientSideSuspense fallback={<Loader />}>{children}</ClientSideSuspense>
		</LiveblocksProvider>
	);
};

export default Provider;