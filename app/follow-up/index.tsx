import { ScreenLayout } from "@/components/layout";
import { Box } from "@/components/ui/box";
import { followUpSchema } from "@/constants/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import React from "react";
import { useForm } from "react-hook-form";

const FollowUpScreen = () => {
    const form = useForm({
        resolver: zodResolver(followUpSchema),
        defaultValues: {
            category: "REFERRAL_ADHERENCE",
            priority: "MEDIUM",
            screeningId: "",
            startDate: dayjs().toDate()
        }
    })
    return (
        <ScreenLayout title="Add Followup">
            <Box />
        </ScreenLayout>
    );
};

export default FollowUpScreen;
