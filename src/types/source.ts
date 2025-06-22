export interface SourceType {
  id: number;
  code: "web" | "book" | "magazine" | "original";
  name: "ウェブサイト" | "書籍" | "雑誌" | "オリジナル";
  description?: string;
  is_active: boolean;
  created_at: Date;
}

export interface PhotoType {
  id: number;
  code: "scraped" | "book" | "my_photo";
  name: "スクレイピング" | "書籍" | "自分の写真";
  description?: string;
  is_reference: boolean;
  is_active: boolean;
  created_at: Date;
}
