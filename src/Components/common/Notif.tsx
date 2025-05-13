import { Dialog, Notification } from "@mantine/core";
import { FC, useEffect } from "react";
import { IconAlertOctagonFilled, IconCheck, IconX } from "@tabler/icons-react";
import { setNotification } from "../../stores/common";
import { useDispatch } from "react-redux";
import React from "react";

interface NotifProps {
  type: string;
  message: string;
}

const Notifications: FC<NotifProps> = (props) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const interval: any = setInterval(() => {
      dispatch(setNotification({} as any));
    }, 10000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <Dialog
        opened={true}
        size="lg"
        radius="md"
        onClose={() => console.log("closed")}
        transitionTimingFunction="ease-in-out"
      >
        {props.type === "Error" ? (
          <Notification
            icon={<IconX size="1.1rem" />}
            color="red"
            title={props.type}
            withCloseButton={false}
          >
            <p className="text-black">{props.message}</p>
          </Notification>
        ) : props.type === "Success" ? (
          <Notification
            icon={<IconCheck size="1.1rem" />}
            color="green"
            title={props.type}
            withCloseButton={false}
          >
            <p className="text-black">{props.message}</p>
          </Notification>
        ) : props.type === "Info" ? (
          <Notification
            icon={<IconAlertOctagonFilled size="1.1rem" />}
            color="yellow"
            title={props.type}
            withCloseButton={false}
          >
            <p className="text-black">{props.message}</p>
          </Notification>
        ) : null}
      </Dialog>
    </>
  );
};

export default Notifications;
