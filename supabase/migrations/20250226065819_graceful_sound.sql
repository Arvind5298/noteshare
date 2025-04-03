/*
  # Initial Schema Setup for College Notes Platform

  1. New Tables
    - `subscriptions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `plan` (text)
      - `active` (boolean)
      - `created_at` (timestamp)
      - `expires_at` (timestamp)
    
    - `notes`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `subject` (text)
      - `file_url` (text)
      - `user_id` (uuid, references auth.users)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `downloads` (integer)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  plan text NOT NULL,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz NOT NULL
);

-- Create notes table
CREATE TABLE IF NOT EXISTS notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  subject text NOT NULL,
  file_url text NOT NULL,
  user_id uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  downloads integer DEFAULT 0
);

-- Enable RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Policies for subscriptions
CREATE POLICY "Users can view their own subscriptions"
  ON subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for notes
CREATE POLICY "Anyone can view notes"
  ON notes
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can upload their own notes"
  ON notes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes"
  ON notes
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);