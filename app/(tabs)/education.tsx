import {
  ChatBotTabPanel,
  EducationResourcesTabPanel,
  FAQTabPannel,
} from "@/components/education";
import EducationTabs, {
  EducationTabsProps,
} from "@/components/education/EducationTabs";
import { CHPLandingScreenLayout } from "@/components/layout";
import { Box } from "@/components/ui/box";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const EducationScreen = () => {
  const [activeTab, setActiveTab] =
    useState<EducationTabsProps["activeTab"]>("chatbot");
  return (
    <SafeAreaView className="flex-1 bg-background-0">
      <CHPLandingScreenLayout>
        <Box className="flex-1 p-4">
          <EducationTabs activeTab={activeTab} onTabChange={setActiveTab} />
          <Box className="flex-1 mt-3">
            {activeTab === "chatbot" && <ChatBotTabPanel />}
            {activeTab === "faq" && <FAQTabPannel />}
            {activeTab === "content" && <EducationResourcesTabPanel />}
          </Box>
        </Box>
      </CHPLandingScreenLayout>
    </SafeAreaView>
  );
};

export default EducationScreen;
