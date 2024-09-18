// globalState.ts
export let aadObjectId: string = '';

export function setAadObjectId(id: string) {
  aadObjectId = id;
}

export function getAadObjectId(): string {
  return aadObjectId;
}