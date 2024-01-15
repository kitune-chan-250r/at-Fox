import { makeStyles } from "@mui/styles";
import { Fragment, memo, useState } from "react";
import { ClientNotification } from "./Notifications";
import {
    Timeline,
    TimelineItem,
    TimelineSeparator,
    TimelineConnector,
    TimelineContent,
    TimelineDot,
} from "@mui/lab";
import { AppBskyEmbedRecord, AppBskyFeedDefs } from "@atproto/api";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
} from "@mui/material";
import ReactionNotificationSummary from "./ReactionNotificationSummary";
import EmbedFeed from "../EmbedFeed";
import Feed from "../Feed";
import { NotificationSummaryFeed } from "./NotificationSummaryFeed";
import { PostView } from "@atproto/api/dist/client/types/app/bsky/feed/defs";

const useStyles = makeStyles({});

interface Props {
    // index: number;
    clientNotification: ClientNotification;
}

/**
 * 個々の通知を描画するコンポーネント
 */
export const Notification = ({ clientNotification }: Props) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <TimelineItem>
            <TimelineSeparator>
                <TimelineDot />
                <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
                <Accordion>
                    <AccordionSummary>
                        {/* <h3>Notification</h3> */}
                        {clientNotification.likeOrRepost !== undefined && (
                            <ReactionNotificationSummary
                                reasonSubject={clientNotification.reasonSubject}
                                likeOrRepost={clientNotification.likeOrRepost}
                            />
                        )}

                        {clientNotification.other !== undefined && (
                            <p>{clientNotification.other.reason}</p>
                        )}
                    </AccordionSummary>
                    <AccordionDetails>
                        <p>Notification</p>
                    </AccordionDetails>
                </Accordion>
            </TimelineContent>
        </TimelineItem>
    );
};

export default memo(Notification);
