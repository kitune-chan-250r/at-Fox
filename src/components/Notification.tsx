import { makeStyles } from "@mui/styles";
import { Fragment, memo } from "react";
import { ClientNotification } from "./Notifications";
import {
    Timeline,
    TimelineItem,
    TimelineSeparator,
    TimelineConnector,
    TimelineContent,
    TimelineDot,
} from "@mui/lab";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import ReactionNotificationSummary from "./Notification/ReactionNotificationSummary";

const useStyles = makeStyles({});

interface Props {
    // index: number;
    clientNotification: ClientNotification;
}

/**
 * 個々の通知を描画するコンポーネントexpanded={false}
 */
export const Notification = ({ clientNotification }: Props) => {
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
