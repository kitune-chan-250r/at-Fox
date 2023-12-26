import { makeStyles } from '@mui/styles';
import { Fragment, memo } from 'react';
import { ClientNotification } from './Notifications';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot } from '@mui/lab';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import ReactionNotificationSummary from './Notification/ReactionNotificationSummary';

const useStyles = makeStyles({

});


interface Props {
    index: number,
    clientNotification: ClientNotification,
}

/**
 * 個々の通知を描画するコンポーネントexpanded={false}
 */
export const Notification = ({ index, clientNotification }: Props) => {

    return (
        <TimelineItem key={"notification_" + index}>
            <TimelineSeparator key={"notification_" + index}>
                <TimelineDot />
                <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent key={"notification_content" + index}>
                <Accordion key={"notification_accordion" + index} >
                    <AccordionSummary key={"notification_accordion_summary" + index}>
                        {/* <h3>Notification</h3> */}
                        {clientNotification.likeOrRepost !== undefined &&
                            <ReactionNotificationSummary
                                reasonSubject={clientNotification.reasonSubject}
                                likeOrRepost={clientNotification.likeOrRepost}
                            />
                        }

                        {clientNotification.other !== undefined &&
                            <p>{clientNotification.other.reason}</p>

                        }

                    </AccordionSummary>
                    <AccordionDetails key={"notification_details" + index}>
                        <p>Notification</p>
                    </AccordionDetails>
                </Accordion>
            </TimelineContent>
        </TimelineItem>
    );
}

export default memo(Notification);