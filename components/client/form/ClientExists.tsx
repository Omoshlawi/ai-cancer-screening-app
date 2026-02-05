import {
  FormControlHelper,
  FormControlHelperText,
} from "@/components/ui/form-control";
import { useClients } from "@/hooks/useClients";
import React, { FC } from "react";

type ClientExistsProps = {
  phoneNumber?: string;
};
const ClientExists: FC<ClientExistsProps> = ({ phoneNumber }) => {
  const { totalCount } = useClients({
    limit: "1",
    phoneNumber: phoneNumber as string,
  });

  if (totalCount > 0)
    return (
      <FormControlHelper>
        <FormControlHelperText className="text-error-500">
          Client with similar phone number exists
        </FormControlHelperText>
      </FormControlHelper>
    );
  return null;
};

export default ClientExists;
