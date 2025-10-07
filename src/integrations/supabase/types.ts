export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      audit_snapshots: {
        Row: {
          canonical_status: string | null
          crawled_at: string
          created_at: string
          description_length: number | null
          h1s: string[] | null
          id: string
          indexable: boolean | null
          meta_description: string | null
          robots_meta: string | null
          seo_title: string | null
          status_code: number | null
          title_length: number | null
          url_id: string
        }
        Insert: {
          canonical_status?: string | null
          crawled_at?: string
          created_at?: string
          description_length?: number | null
          h1s?: string[] | null
          id?: string
          indexable?: boolean | null
          meta_description?: string | null
          robots_meta?: string | null
          seo_title?: string | null
          status_code?: number | null
          title_length?: number | null
          url_id: string
        }
        Update: {
          canonical_status?: string | null
          crawled_at?: string
          created_at?: string
          description_length?: number | null
          h1s?: string[] | null
          id?: string
          indexable?: boolean | null
          meta_description?: string | null
          robots_meta?: string | null
          seo_title?: string | null
          status_code?: number | null
          title_length?: number | null
          url_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_snapshots_url_id_fkey"
            columns: ["url_id"]
            isOneToOne: false
            referencedRelation: "url_performance_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_snapshots_url_id_fkey"
            columns: ["url_id"]
            isOneToOne: false
            referencedRelation: "urls"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_comment_likes: {
        Row: {
          comment_id: string
          created_at: string
          id: string
          ip_address: string | null
          user_id: string | null
        }
        Insert: {
          comment_id: string
          created_at?: string
          id?: string
          ip_address?: string | null
          user_id?: string | null
        }
        Update: {
          comment_id?: string
          created_at?: string
          id?: string
          ip_address?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_comment_likes_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "blog_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_comment_reports: {
        Row: {
          comment_id: string
          created_at: string
          id: string
          reason: string
          reporter_email: string
        }
        Insert: {
          comment_id: string
          created_at?: string
          id?: string
          reason: string
          reporter_email: string
        }
        Update: {
          comment_id?: string
          created_at?: string
          id?: string
          reason?: string
          reporter_email?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_comment_reports_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "blog_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_comments: {
        Row: {
          author_email: string
          author_name: string
          content: string
          created_at: string
          id: string
          ip_address: string | null
          parent_comment_id: string | null
          post_id: string
          spam_score: number | null
          status: string
          updated_at: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          author_email: string
          author_name: string
          content: string
          created_at?: string
          id?: string
          ip_address?: string | null
          parent_comment_id?: string | null
          post_id: string
          spam_score?: number | null
          status?: string
          updated_at?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          author_email?: string
          author_name?: string
          content?: string
          created_at?: string
          id?: string
          ip_address?: string | null
          parent_comment_id?: string | null
          post_id?: string
          spam_score?: number | null
          status?: string
          updated_at?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "blog_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "cms_blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      board_edges: {
        Row: {
          board_id: string
          created_at: string
          edge_type: string
          id: string
          label: string | null
          source_node_id: string
          style_data: Json | null
          target_node_id: string
        }
        Insert: {
          board_id: string
          created_at?: string
          edge_type?: string
          id?: string
          label?: string | null
          source_node_id: string
          style_data?: Json | null
          target_node_id: string
        }
        Update: {
          board_id?: string
          created_at?: string
          edge_type?: string
          id?: string
          label?: string | null
          source_node_id?: string
          style_data?: Json | null
          target_node_id?: string
        }
        Relationships: []
      }
      board_nodes: {
        Row: {
          board_id: string
          created_at: string
          custom_data: Json | null
          custom_title: string | null
          height: number | null
          id: string
          node_type: string
          position_x: number
          position_y: number
          updated_at: string
          url_id: string | null
          width: number | null
        }
        Insert: {
          board_id: string
          created_at?: string
          custom_data?: Json | null
          custom_title?: string | null
          height?: number | null
          id?: string
          node_type?: string
          position_x: number
          position_y: number
          updated_at?: string
          url_id?: string | null
          width?: number | null
        }
        Update: {
          board_id?: string
          created_at?: string
          custom_data?: Json | null
          custom_title?: string | null
          height?: number | null
          id?: string
          node_type?: string
          position_x?: number
          position_y?: number
          updated_at?: string
          url_id?: string | null
          width?: number | null
        }
        Relationships: []
      }
      boards: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          settings: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          settings?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          settings?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      cms_blog_posts: {
        Row: {
          author: string
          category_id: string | null
          content: string | null
          cover_image_alt: string | null
          cover_image_url: string | null
          created_at: string
          excerpt: string | null
          featured: boolean | null
          id: string
          published: boolean | null
          published_at: string | null
          read_time: string | null
          seo_description: string | null
          seo_keywords: string[] | null
          seo_title: string | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          author: string
          category_id?: string | null
          content?: string | null
          cover_image_alt?: string | null
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string | null
          featured?: boolean | null
          id?: string
          published?: boolean | null
          published_at?: string | null
          read_time?: string | null
          seo_description?: string | null
          seo_keywords?: string[] | null
          seo_title?: string | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          author?: string
          category_id?: string | null
          content?: string | null
          cover_image_alt?: string | null
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string | null
          featured?: boolean | null
          id?: string
          published?: boolean | null
          published_at?: string | null
          read_time?: string | null
          seo_description?: string | null
          seo_keywords?: string[] | null
          seo_title?: string | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cms_blog_posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "cms_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_categories: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      cms_footer_content: {
        Row: {
          copyright_text: string
          created_at: string
          description: string
          email: string | null
          id: string
          linkedin_url: string | null
          newsletter_description: string
          newsletter_title: string
          twitter_url: string | null
          updated_at: string
          youtube_url: string | null
        }
        Insert: {
          copyright_text: string
          created_at?: string
          description: string
          email?: string | null
          id?: string
          linkedin_url?: string | null
          newsletter_description: string
          newsletter_title: string
          twitter_url?: string | null
          updated_at?: string
          youtube_url?: string | null
        }
        Update: {
          copyright_text?: string
          created_at?: string
          description?: string
          email?: string | null
          id?: string
          linkedin_url?: string | null
          newsletter_description?: string
          newsletter_title?: string
          twitter_url?: string | null
          updated_at?: string
          youtube_url?: string | null
        }
        Relationships: []
      }
      cms_global_settings: {
        Row: {
          created_at: string
          favicon_url: string | null
          id: string
          logo_url: string | null
          primary_color: string | null
          secondary_color: string | null
          site_description: string
          site_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          favicon_url?: string | null
          id?: string
          logo_url?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          site_description: string
          site_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          favicon_url?: string | null
          id?: string
          logo_url?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          site_description?: string
          site_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      cms_homepage_content: {
        Row: {
          created_at: string
          hero_cta_primary: string
          hero_cta_secondary: string
          hero_description: string
          hero_image_alt: string | null
          hero_image_url: string | null
          hero_title: string
          id: string
          main_hero_cta_primary: string | null
          main_hero_cta_secondary: string | null
          main_hero_description: string | null
          main_hero_lives_impacted: string | null
          main_hero_market_crises: string | null
          main_hero_motto: string | null
          main_hero_subtitle: string | null
          main_hero_title: string | null
          main_hero_years_experience: string | null
          stats_newsletter: string | null
          stats_subscribers: string | null
          stats_videos: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          hero_cta_primary: string
          hero_cta_secondary: string
          hero_description: string
          hero_image_alt?: string | null
          hero_image_url?: string | null
          hero_title: string
          id?: string
          main_hero_cta_primary?: string | null
          main_hero_cta_secondary?: string | null
          main_hero_description?: string | null
          main_hero_lives_impacted?: string | null
          main_hero_market_crises?: string | null
          main_hero_motto?: string | null
          main_hero_subtitle?: string | null
          main_hero_title?: string | null
          main_hero_years_experience?: string | null
          stats_newsletter?: string | null
          stats_subscribers?: string | null
          stats_videos?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          hero_cta_primary?: string
          hero_cta_secondary?: string
          hero_description?: string
          hero_image_alt?: string | null
          hero_image_url?: string | null
          hero_title?: string
          id?: string
          main_hero_cta_primary?: string | null
          main_hero_cta_secondary?: string | null
          main_hero_description?: string | null
          main_hero_lives_impacted?: string | null
          main_hero_market_crises?: string | null
          main_hero_motto?: string | null
          main_hero_subtitle?: string | null
          main_hero_title?: string | null
          main_hero_years_experience?: string | null
          stats_newsletter?: string | null
          stats_subscribers?: string | null
          stats_videos?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      cms_navigation_items: {
        Row: {
          created_at: string
          href: string
          id: string
          label: string
          order_index: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          href: string
          id?: string
          label: string
          order_index?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          href?: string
          id?: string
          label?: string
          order_index?: number
          updated_at?: string
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          status: string | null
          subject: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          status?: string | null
          subject: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          status?: string | null
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      gsc_sync_log: {
        Row: {
          created_at: string
          end_time: string | null
          error_message: string | null
          id: string
          rows_processed: number | null
          start_time: string
          status: string
          sync_date: string
        }
        Insert: {
          created_at?: string
          end_time?: string | null
          error_message?: string | null
          id?: string
          rows_processed?: number | null
          start_time?: string
          status?: string
          sync_date: string
        }
        Update: {
          created_at?: string
          end_time?: string | null
          error_message?: string | null
          id?: string
          rows_processed?: number | null
          start_time?: string
          status?: string
          sync_date?: string
        }
        Relationships: []
      }
      keywords: {
        Row: {
          created_at: string
          device: string | null
          id: string
          keyword: string
          locale: string | null
          notes: string | null
          search_intent: string | null
          volume: number | null
        }
        Insert: {
          created_at?: string
          device?: string | null
          id?: string
          keyword: string
          locale?: string | null
          notes?: string | null
          search_intent?: string | null
          volume?: number | null
        }
        Update: {
          created_at?: string
          device?: string | null
          id?: string
          keyword?: string
          locale?: string | null
          notes?: string | null
          search_intent?: string | null
          volume?: number | null
        }
        Relationships: []
      }
      rank_snapshots: {
        Row: {
          confidence_score: number | null
          created_at: string
          current_position: number | null
          data_source: string | null
          device: string | null
          gsc_avg_position: number | null
          gsc_clicks: number | null
          gsc_country: string | null
          gsc_ctr: number | null
          gsc_device: string | null
          gsc_impressions: number | null
          gsc_page: string | null
          gsc_query: string | null
          id: string
          keyword_id: string
          manual_override: boolean | null
          market: string | null
          override_reason: string | null
          ranking_url_detected: string | null
          serp_features: string[] | null
          serp_title: string | null
          serp_url_found: string | null
          snapshot_date: string
          suspicious_change: boolean | null
          url_id: string
          volume: number | null
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string
          current_position?: number | null
          data_source?: string | null
          device?: string | null
          gsc_avg_position?: number | null
          gsc_clicks?: number | null
          gsc_country?: string | null
          gsc_ctr?: number | null
          gsc_device?: string | null
          gsc_impressions?: number | null
          gsc_page?: string | null
          gsc_query?: string | null
          id?: string
          keyword_id: string
          manual_override?: boolean | null
          market?: string | null
          override_reason?: string | null
          ranking_url_detected?: string | null
          serp_features?: string[] | null
          serp_title?: string | null
          serp_url_found?: string | null
          snapshot_date: string
          suspicious_change?: boolean | null
          url_id: string
          volume?: number | null
        }
        Update: {
          confidence_score?: number | null
          created_at?: string
          current_position?: number | null
          data_source?: string | null
          device?: string | null
          gsc_avg_position?: number | null
          gsc_clicks?: number | null
          gsc_country?: string | null
          gsc_ctr?: number | null
          gsc_device?: string | null
          gsc_impressions?: number | null
          gsc_page?: string | null
          gsc_query?: string | null
          id?: string
          keyword_id?: string
          manual_override?: boolean | null
          market?: string | null
          override_reason?: string | null
          ranking_url_detected?: string | null
          serp_features?: string[] | null
          serp_title?: string | null
          serp_url_found?: string | null
          snapshot_date?: string
          suspicious_change?: boolean | null
          url_id?: string
          volume?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "rank_snapshots_keyword_id_fkey"
            columns: ["keyword_id"]
            isOneToOne: false
            referencedRelation: "keywords"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rank_snapshots_url_id_fkey"
            columns: ["url_id"]
            isOneToOne: false
            referencedRelation: "url_performance_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rank_snapshots_url_id_fkey"
            columns: ["url_id"]
            isOneToOne: false
            referencedRelation: "urls"
            referencedColumns: ["id"]
          },
        ]
      }
      track_history: {
        Row: {
          album_art: string | null
          artist: string
          dj: string | null
          id: string
          played_at: string
          show_id: string | null
          title: string
        }
        Insert: {
          album_art?: string | null
          artist: string
          dj?: string | null
          id?: string
          played_at?: string
          show_id?: string | null
          title: string
        }
        Update: {
          album_art?: string | null
          artist?: string
          dj?: string | null
          id?: string
          played_at?: string
          show_id?: string | null
          title?: string
        }
        Relationships: []
      }
      url_groups: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      url_keywords: {
        Row: {
          created_at: string
          id: string
          keyword_id: string
          landing_page_lock: boolean | null
          primary_keyword: boolean | null
          target_match_type: string | null
          url_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          keyword_id: string
          landing_page_lock?: boolean | null
          primary_keyword?: boolean | null
          target_match_type?: string | null
          url_id: string
        }
        Update: {
          created_at?: string
          id?: string
          keyword_id?: string
          landing_page_lock?: boolean | null
          primary_keyword?: boolean | null
          target_match_type?: string | null
          url_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "url_keywords_keyword_id_fkey"
            columns: ["keyword_id"]
            isOneToOne: false
            referencedRelation: "keywords"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "url_keywords_url_id_fkey"
            columns: ["url_id"]
            isOneToOne: false
            referencedRelation: "url_performance_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "url_keywords_url_id_fkey"
            columns: ["url_id"]
            isOneToOne: false
            referencedRelation: "urls"
            referencedColumns: ["id"]
          },
        ]
      }
      url_tags: {
        Row: {
          created_at: string
          id: string
          priority: number | null
          tag_category: Database["public"]["Enums"]["tag_category_enum"] | null
          tag_name: string
          url_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          priority?: number | null
          tag_category?: Database["public"]["Enums"]["tag_category_enum"] | null
          tag_name: string
          url_id: string
        }
        Update: {
          created_at?: string
          id?: string
          priority?: number | null
          tag_category?: Database["public"]["Enums"]["tag_category_enum"] | null
          tag_name?: string
          url_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "url_tags_url_id_fkey"
            columns: ["url_id"]
            isOneToOne: false
            referencedRelation: "url_performance_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "url_tags_url_id_fkey"
            columns: ["url_id"]
            isOneToOne: false
            referencedRelation: "urls"
            referencedColumns: ["id"]
          },
        ]
      }
      urls: {
        Row: {
          canonical_url: string | null
          created_at: string
          group_id: string | null
          h1s: string[] | null
          id: string
          indexable: boolean | null
          last_crawled_at: string | null
          meta_description: string | null
          notes: string | null
          notes_updated_at: string | null
          og_description: string | null
          og_title: string | null
          path: string
          robots_meta: string | null
          seo_title: string | null
          status_code: number | null
          updated_at: string
          url: string
          user_id: string
        }
        Insert: {
          canonical_url?: string | null
          created_at?: string
          group_id?: string | null
          h1s?: string[] | null
          id?: string
          indexable?: boolean | null
          last_crawled_at?: string | null
          meta_description?: string | null
          notes?: string | null
          notes_updated_at?: string | null
          og_description?: string | null
          og_title?: string | null
          path: string
          robots_meta?: string | null
          seo_title?: string | null
          status_code?: number | null
          updated_at?: string
          url: string
          user_id: string
        }
        Update: {
          canonical_url?: string | null
          created_at?: string
          group_id?: string | null
          h1s?: string[] | null
          id?: string
          indexable?: boolean | null
          last_crawled_at?: string | null
          meta_description?: string | null
          notes?: string | null
          notes_updated_at?: string | null
          og_description?: string | null
          og_title?: string | null
          path?: string
          robots_meta?: string | null
          seo_title?: string | null
          status_code?: number | null
          updated_at?: string
          url?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "urls_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "url_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      youtube_channels: {
        Row: {
          channel_description: string | null
          channel_id: string
          channel_title: string
          created_at: string
          custom_url: string | null
          id: string
          published_at: string | null
          subscriber_count: number | null
          thumbnail_url: string | null
          updated_at: string
          video_count: number | null
          view_count: number | null
        }
        Insert: {
          channel_description?: string | null
          channel_id: string
          channel_title: string
          created_at?: string
          custom_url?: string | null
          id?: string
          published_at?: string | null
          subscriber_count?: number | null
          thumbnail_url?: string | null
          updated_at?: string
          video_count?: number | null
          view_count?: number | null
        }
        Update: {
          channel_description?: string | null
          channel_id?: string
          channel_title?: string
          created_at?: string
          custom_url?: string | null
          id?: string
          published_at?: string | null
          subscriber_count?: number | null
          thumbnail_url?: string | null
          updated_at?: string
          video_count?: number | null
          view_count?: number | null
        }
        Relationships: []
      }
      youtube_videos: {
        Row: {
          category_name: string | null
          channel_id: string
          comment_count: number | null
          created_at: string
          description: string | null
          duration: string | null
          id: string
          is_featured: boolean | null
          like_count: number | null
          published_at: string
          tags: string[] | null
          thumbnail_default: string | null
          thumbnail_high: string | null
          thumbnail_maxres: string | null
          thumbnail_medium: string | null
          thumbnail_standard: string | null
          title: string
          updated_at: string
          video_id: string
          video_type: string | null
          view_count: number | null
        }
        Insert: {
          category_name?: string | null
          channel_id: string
          comment_count?: number | null
          created_at?: string
          description?: string | null
          duration?: string | null
          id?: string
          is_featured?: boolean | null
          like_count?: number | null
          published_at: string
          tags?: string[] | null
          thumbnail_default?: string | null
          thumbnail_high?: string | null
          thumbnail_maxres?: string | null
          thumbnail_medium?: string | null
          thumbnail_standard?: string | null
          title: string
          updated_at?: string
          video_id: string
          video_type?: string | null
          view_count?: number | null
        }
        Update: {
          category_name?: string | null
          channel_id?: string
          comment_count?: number | null
          created_at?: string
          description?: string | null
          duration?: string | null
          id?: string
          is_featured?: boolean | null
          like_count?: number | null
          published_at?: string
          tags?: string[] | null
          thumbnail_default?: string | null
          thumbnail_high?: string | null
          thumbnail_maxres?: string | null
          thumbnail_medium?: string | null
          thumbnail_standard?: string | null
          title?: string
          updated_at?: string
          video_id?: string
          video_type?: string | null
          view_count?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      url_performance_summary: {
        Row: {
          avg_ctr: number | null
          avg_position: number | null
          id: string | null
          indexable: boolean | null
          last_crawled_at: string | null
          path: string | null
          primary_keywords: number | null
          seo_title: string | null
          status_code: number | null
          total_clicks: number | null
          total_impressions: number | null
          total_keywords: number | null
          url: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      tag_category_enum:
        | "industry"
        | "content_type"
        | "functional"
        | "audience"
        | "general"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      tag_category_enum: [
        "industry",
        "content_type",
        "functional",
        "audience",
        "general",
      ],
    },
  },
} as const
