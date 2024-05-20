import { Permission, Users } from "../views/app/user/users.interface";

export const getCompanyId = () => {
  let id = 0
  try {
    id = Number(localStorage.getItem('company_login_id')) || 0;
  } catch (error) {
    console.log(">>>> src/app/utils/util.js : getUserId -> error", error)
    id = 0;
  }
  return id;
}

export const setCompanyId = (userId: number) => {
  try {
    localStorage.setItem('company_login_id', String(userId));
  } catch (error) {
    console.log(">>>> src/app/utils/util.js : setUserId -> error")
  }
}

export const getUserId = () => {
  let id = 0
  try {
    id = Number(localStorage.getItem('user_login_id')) || 0;
  } catch (error) {
    console.log(">>>> src/app/utils/util.js : getUserId -> error", error)
    id = 0;
  }
  return id;
}

export const setUserId = (userId: number) => {
  try {
    localStorage.setItem('user_login_id', String(userId));
  } catch (error) {
    console.log(">>>> src/app/utils/util.js : setUserId -> error")
  }
}

export const getUserEmail = () => {
  let token = '';
  try {
    token = localStorage.getItem('user_login_email') || '';
  } catch (error) {
    console.log(">>>> src/app/utils/util.js : getUserEmail -> error", error)
    token = '';
  }
  return token;
}

export const setUserEmail = (email: string) => {
  try {
    localStorage.setItem('user_login_email', email);
  } catch (error) {
    console.log(">>>> src/app/utils/util.js : setUserEmail -> error")
  }
}

export const setUser = (user: Users) => {
  try {
    localStorage.setItem('user_data', JSON.stringify(user));
  } catch (error) {
    console.log(">>>> src/app/utils/util.js : setUser -> error")
  }
}

export const getUser = () => {
  try {
    let token = localStorage.getItem('user_data');
    if (token)
      return JSON.parse(token);
    else
      return null;
  } catch (error) {
    console.log(">>>> src/app/utils/util.js : getUserEmail -> error", error)
    return null;
  }
}

export const setPermision = (user: Permission) => {
  try {
    localStorage.setItem('user_permission', JSON.stringify(user));
  } catch (error) {
    console.log(">>>> src/app/utils/util.js : setUser -> error")
  }
}

export const getPermision = (): Permission | null => {
  try {
    let token = localStorage.getItem('user_permission');
    if (token)
      return JSON.parse(token);
    else
      return null;
  } catch (error) {
    console.log(">>>> src/app/utils/util.js : getUserEmail -> error", error)
    return null;
  }
}

export const clearSession = () => {
  localStorage.clear();
}

export const formatCurrency = (value: number) => {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// export const getBaseUrl = () => {
//   const role = getUserRole();

//   if (role === "1") {
//     return environment.adminRoot;
//   }

//   if (role === "2") {
//     return environment.storeRoot;
//   }

//   if (role === "3") {
//     return environment.sellerRoot;
//   }

//   return environment.storeRoot;
// }
