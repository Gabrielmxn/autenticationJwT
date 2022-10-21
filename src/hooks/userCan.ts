import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { validadeUserPermissions } from "../utils/validateUserPermissions";

type UserCanParams = {
  permissions?: string[];
  roles?: string[];
}

export function userCan({permissions = [], roles = []} : UserCanParams){
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const {user, isAuthenticated} = useContext(AuthContext)
  
  if(!isAuthenticated){
    return false;
  }

  const userHasValidPermissions = validadeUserPermissions({
    user, 
    permissions, 
    roles
  });

}