

export enum SocialChannel {
  TELEGRAM_CHANNEL = 'telegram_channel',
  TELEGRAM_GROUP = 'telegram_group',
  // TWITTER = 'twitter',
  // FACEBOOK = 'facebook',
  // INSTAGRAM = 'instagram',
  // TIKTOK = 'tiktok',
  // YOUTUBE = 'youtube',
}


export interface SocialData {
  id: string,
  url: string,
  title: string,
  image: string,
}
