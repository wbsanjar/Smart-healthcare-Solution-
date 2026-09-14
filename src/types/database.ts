export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string
          phone: string
          blood_type: string
          date_of_birth: string | null
          address: string
          emergency_contact: Json
          medical_conditions: string[]
          allergies: string[]
          current_medications: string[]
          location_lat: number
          location_lng: number
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string
          phone?: string
          blood_type?: string
          date_of_birth?: string | null
          address?: string
          emergency_contact?: Json
          medical_conditions?: string[]
          allergies?: string[]
          current_medications?: string[]
          location_lat?: number
          location_lng?: number
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          phone?: string
          blood_type?: string
          date_of_birth?: string | null
          address?: string
          emergency_contact?: Json
          medical_conditions?: string[]
          allergies?: string[]
          current_medications?: string[]
          location_lat?: number
          location_lng?: number
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      hospitals: {
        Row: {
          id: string
          name: string
          address: string
          phone: string
          location_lat: number
          location_lng: number
          emergency_capacity: number
          available_beds: number
          specialties: string[]
          accepts_emergency: boolean
          rating: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          address: string
          phone?: string
          location_lat: number
          location_lng: number
          emergency_capacity?: number
          available_beds?: number
          specialties?: string[]
          accepts_emergency?: boolean
          rating?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          address?: string
          phone?: string
          location_lat?: number
          location_lng?: number
          emergency_capacity?: number
          available_beds?: number
          specialties?: string[]
          accepts_emergency?: boolean
          rating?: number
          created_at?: string
          updated_at?: string
        }
      }
      ambulances: {
        Row: {
          id: string
          vehicle_number: string
          driver_name: string
          driver_phone: string
          location_lat: number
          location_lng: number
          status: string
          hospital_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          vehicle_number: string
          driver_name?: string
          driver_phone?: string
          location_lat?: number
          location_lng?: number
          status?: string
          hospital_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          vehicle_number?: string
          driver_name?: string
          driver_phone?: string
          location_lat?: number
          location_lng?: number
          status?: string
          hospital_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      emergency_requests: {
        Row: {
          id: string
          user_id: string
          hospital_id: string | null
          ambulance_id: string | null
          status: string
          severity: string
          symptoms: string[]
          description: string
          pickup_location: Json
          estimated_arrival: string | null
          actual_arrival: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          hospital_id?: string | null
          ambulance_id?: string | null
          status?: string
          severity?: string
          symptoms?: string[]
          description?: string
          pickup_location?: Json
          estimated_arrival?: string | null
          actual_arrival?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          hospital_id?: string | null
          ambulance_id?: string | null
          status?: string
          severity?: string
          symptoms?: string[]
          description?: string
          pickup_location?: Json
          estimated_arrival?: string | null
          actual_arrival?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      chat_sessions: {
        Row: {
          id: string
          user_id: string
          title: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      chat_messages: {
        Row: {
          id: string
          session_id: string
          user_id: string
          role: string
          content: string
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          user_id: string
          role: string
          content: string
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          user_id?: string
          role?: string
          content?: string
          metadata?: Json
          created_at?: string
        }
      }
      patient_vitals: {
        Row: {
          id: string
          user_id: string
          emergency_request_id: string | null
          heart_rate: number | null
          blood_pressure: string
          temperature: number | null
          oxygen_level: number | null
          respiratory_rate: number | null
          notes: string
          recorded_at: string
        }
        Insert: {
          id?: string
          user_id: string
          emergency_request_id?: string | null
          heart_rate?: number | null
          blood_pressure?: string
          temperature?: number | null
          oxygen_level?: number | null
          respiratory_rate?: number | null
          notes?: string
          recorded_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          emergency_request_id?: string | null
          heart_rate?: number | null
          blood_pressure?: string
          temperature?: number | null
          oxygen_level?: number | null
          respiratory_rate?: number | null
          notes?: string
          recorded_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
