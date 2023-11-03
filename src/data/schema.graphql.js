import { gql } from "graphql-tag";

const typeDefs = gql`
  scalar JSON_Object
  enum Gender {
    MALE
    FEMALE
    OTHER
  }

  type Contact {
    firstName: String
    lastName: String
  }

  type Friend {
    id: ID
    firstName: String
    lastName: String
    gender: Gender
    language: String
    age: Int
    email: String
    company: Company
    contacts: [Contact]
  }

  type Company {
    id: ID
    company_name: String!
    email: String!
    building: String!
    locality: String!
    city: String!
    state: String!
    primary_contact: String!
    secondary_contact: String!
  }

  input ContactInput {
    firstName: String
    lastName: String
  }

  input FriendRequestDTO {
    id: ID
    firstName: String
    lastName: String
    gender: Gender
    language: String
    age: Int
    email: String
    contacts: [ContactInput]
  }

  input SignupDTO {
    firstName: String!
    lastName: String!
    password: String!
    company: String!
    gender: Gender
    language: String
    age: Int
    email: String!
    contacts: [ContactInput]
  }

  type QueryFriendResponse {
    message: String
    status: String
    data: [Friend]
    meta: JSON_Object
  }

  type SignupResponse {
    message: String
    status: String
    refresh_token: JSON_Object
    access_token: JSON_Object
    data: [Friend]
    meta: JSON_Object
  }

  type MutationFriendResponse {
    message: String
    status: String
    data: Friend
    meta: JSON_Object
  }

  input Identity {
    id: ID
  }

  input LoginDTO {
    email: String!
    password: String!
  }

  input TokenDTO {
    refresh_token: String
  }

  input ResetPasswordDTO {
    email: String!
  }

  input PasswordResetDTO {
    email: String!
    password_request_otp: String!
    new_password: String!
    reenter_password: String!
  }

  input CreateCompanyDTO {
    company_name: String!
    email: String!
    building: String!
    locality: String!
    city: String!
    state: String!
    primary_contact: String!
    secondary_contact: String!
  }

  type CompanyResponse {
    message: String
    status: String
    data: [Company]
    meta: JSON_Object
  }

  type Query {
    regenerate_token: SignupResponse
    profile: QueryFriendResponse
  }

  input PostTweetDTO {
    tweet_string: String
  }

  input TweetDeleteDTO {
    tweet_id: String
  }

  input FollowDTO {
    now_following_id: String
  }

  type TweetResponse {
    message: String
    status: String
    meta: JSON_Object
  }

  type FollowResponse {
    message: String
    status: String
    meta: JSON_Object
  }

  type Mutation {
    updateFriend(input: FriendRequestDTO): MutationFriendResponse
    sign_up(input: SignupDTO): SignupResponse
    login(input: LoginDTO): SignupResponse
    reset_password(input: ResetPasswordDTO): MutationFriendResponse
    set_password(input: PasswordResetDTO): MutationFriendResponse
    add_company(input: CreateCompanyDTO): CompanyResponse
    post_tweet(input: PostTweetDTO): TweetResponse
    delete_tweet(input: TweetDeleteDTO): TweetResponse
    follow_someone(input: FollowDTO): FollowResponse
    unfollow_someone(input: FollowDTO): FollowResponse
  }
`;

export default typeDefs;
