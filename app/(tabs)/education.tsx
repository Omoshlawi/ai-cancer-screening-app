import { ChatBotTabPanel } from "@/components/education";
import { CHPLandingScreenLayout } from "@/components/layout";
import { Box } from "@/components/ui/box";
import React from "react";

const EducationScreen = () => {
  return (
    <CHPLandingScreenLayout>
      <Box className="flex-1 p-4">
        <ChatBotTabPanel />
      </Box>
    </CHPLandingScreenLayout>
  );
};

export default EducationScreen;
