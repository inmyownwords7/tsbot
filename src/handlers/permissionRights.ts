// Permission values for each custom group
const groupPermissionValues = {
  isDeputy: 10,
};

// Calculate permission level based on `GroupMetaData`
function calculatePermissionLevel(metadata: GroupMetaData): number {
  return Object.entries(groupPermissionValues).reduce((level, [key, value]) => {
    return metadata[key as keyof GroupMetaData] ? level + value : level;
  }, 0);
}

// Define access rights based on permission levels
const permissionLevels: Record<number, PermissionRights> = {
  15: {
    permissionLevel: 15,
    canBan: true,
    canTimeout: true,
    canSendMessage: true,
    canUseCommands: true,
    canAccessSubOnlyContent: true,
  },
  10: {
    permissionLevel: 10,
    canBan: true,
    canTimeout: true,
    canSendMessage: true,
    canUseCommands: true,
    canAccessSubOnlyContent: false,
  },
  5: {
    permissionLevel: 5,
    canBan: false,
    canTimeout: true,
    canSendMessage: true,
    canUseCommands: true,
    canAccessSubOnlyContent: false,
  },
};

// Retrieve the access rights for a given permission level
function getPermissionRights(level: number): PermissionRights | undefined {
  return permissionLevels[level] || permissionLevels[5]; // Default to level 5 if not found
}

// Check if a user has the required permission level
function hasRequiredPermission(metadata: GroupMetaData, requiredLevel: number): boolean {
  const userLevel = calculatePermissionLevel(metadata);
  return userLevel >= requiredLevel;
}

const nonUserCustomGroup: GroupMetaData = {
  isParty: true,
  isStaff: false,
  isDeputy: true,
  isEntitled: true,
  isPermitted: false,
  userName: "",
  userId: "",
};

const userPermissionLevel = calculatePermissionLevel(nonUserCustomGroup);
const userRights = getPermissionRights(userPermissionLevel); // Retrieves the rights based on calculated level
const canAccessFeature = hasRequiredPermission(nonUserCustomGroup, 10);

console.log("User Permission Level:", userPermissionLevel); // Outputs the calculated level
console.log("User Rights:", userRights); // Outputs rights based on user's level
console.log("Can Access Feature:", canAccessFeature); // Outputs `true` if permission level is 10 or higher

export { calculatePermissionLevel, hasRequiredPermission, getPermissionRights, permissionLevels, nonUserCustomGroup, userPermissionLevel, userRights, canAccessFeature };
