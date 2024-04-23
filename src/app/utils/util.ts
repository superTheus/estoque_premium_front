import { environment } from "../environments/environment";
import { User } from "../shared/auth.interface";


// export const getUserRole = () => {
//   let role = environment.defaultRole;
//   try {
//     role = localStorage.getItem('theme_user_role') || environment.defaultRole;
//   } catch (error) {
//     console.log(">>>> src/app/utils/util.js : getUserRole -> error", error)
//     role = environment.defaultRole
//   }
//   return role;
// }

// export const setUserRole = (role) => {
//   try {
//     localStorage.setItem('theme_user_role', role);
//   } catch (error) {
//     console.log(">>>> src/app/utils/util.js : setUserRole -> error", role)
//   }
// }

export const getCompanyId = () => {
  let id = 0
  try {
    id = Number(sessionStorage.getItem('company_login_id')) || 0;
  } catch (error) {
    console.log(">>>> src/app/utils/util.js : getUserId -> error", error)
    id = 0;
  }
  return id;
}

export const setCompanyId = (userId: number) => {
  try {
    sessionStorage.setItem('company_login_id', String(userId));
  } catch (error) {
    console.log(">>>> src/app/utils/util.js : setUserId -> error")
  }
}

export const getUserId = () => {
  let id = 0
  try {
    id = Number(sessionStorage.getItem('user_login_id')) || 0;
  } catch (error) {
    console.log(">>>> src/app/utils/util.js : getUserId -> error", error)
    id = 0;
  }
  return id;
}

export const setUserId = (userId: number) => {
  try {
    sessionStorage.setItem('user_login_id', String(userId));
  } catch (error) {
    console.log(">>>> src/app/utils/util.js : setUserId -> error")
  }
}

export const getUserEmail = () => {
  let token = '';
  try {
    token = sessionStorage.getItem('user_login_email') || '';
  } catch (error) {
    console.log(">>>> src/app/utils/util.js : getUserEmail -> error", error)
    token = '';
  }
  return token;
}

export const setUserEmail = (email: string) => {
  try {
    sessionStorage.setItem('user_login_email', email);
  } catch (error) {
    console.log(">>>> src/app/utils/util.js : setUserEmail -> error")
  }
}

export const setUser = (user: User) => {
  try {
    sessionStorage.setItem('user_data', JSON.stringify(user));
  } catch (error) {
    console.log(">>>> src/app/utils/util.js : setUser -> error")
  }
}

export const getUser = () => {
  try {
    let token = sessionStorage.getItem('user_data');
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
  sessionStorage.clear();
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
