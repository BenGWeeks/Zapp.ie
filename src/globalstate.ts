// globalState.ts
export let aadObjectId: string = '';
export let userEmail: string = '';

export function setAadObjectId(id: string) {
  aadObjectId = id;
}

export function getAadObjectId(): string {
  return aadObjectId;
}

export function setUserEmail(email: string) {
  userEmail = email;
}

export function getUserEmail(): string {
  return userEmail;
}