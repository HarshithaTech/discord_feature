export type UserStatus = 'online' | 'idle' | 'offline';
export type ChannelType = 'text' | 'voice' | 'video';
export type MemberRole = 'admin' | 'moderator' | 'member';

export interface User {
  id: string;
  username: string;
  email: string;
  avatarURL?: string;
  createdAt: string;
  status: UserStatus;
  uid?: string; // For compatibility
}

export interface Server {
  id: string;
  name: string;
  ownerId: string;
  inviteCode: string;
  members?: string[]; // array of userIds
  createdAt: string;
  defaultChannelId?: string;
  imageUrl?: string;
}

export interface Channel {
  id: string;
  serverId: string;
  name: string;
  type: ChannelType;
  position: number;
  createdAt: string;
}

export interface Message {
  id: string;
  channelId: string;
  userId: string;
  content: string;
  attachments: string[]; // URLs
  timestamp: string;
  edited: boolean;
  replyToId?: string;
  username?: string;
  avatarUrl?: string;
}

export interface Member {
  id: string;
  serverId: string;
  profileId: string;
  role: MemberRole;
  joinedAt: string;
}

export interface DMChannel {
  id: string;
  participants: string[]; // array of 2 userIds
  createdAt: string;
  lastMessageAt: string;
}

export interface DMMessage {
  id: string;
  dmChannelId: string;
  senderId: string;
  content: string;
  timestamp: string;
}
