interface SiteInformation {
  id: number;
  site_name: string;
  site_description: string;
  site_keywords: string;
  site_author: string;
  site_email: string;
  site_url: string;
  site_logo: null | string;
  site_favicon: null | string;
  site_facebook: null | string;
  site_youtube: null | string;
  is_registration_enabled: boolean;
  is_email_confirmation_required: boolean;
  is_maintenance_mode: boolean;
  google_api_key: null | string;
  is_google_login_enabled: boolean;
  text_over_logo: boolean;
}
