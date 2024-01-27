export enum UserRule {
  NameMinLength = 3,
  NameMaxLength = 50,
  DescriptionMaxLength = 300,
  MinAge = 18,
}

export enum PasswordRule {
  MinLength = 6,
  MaxLength = 12,
}

export enum ReviewRule {
  TextMinLength = 50,
  TextMaxLength = 500,
  MinRating = 1,
  MaxRating = 5,
  MinFailedTasks = 0,
}
