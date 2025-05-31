-- Add response_id column to game_log table
ALTER TABLE game_log
ADD COLUMN response_id TEXT;

-- Add an index to improve query performance when searching by response_id
CREATE INDEX idx_game_log_response_id ON game_log(response_id);

-- Add a comment to document the column
COMMENT ON COLUMN game_log.response_id IS 'Unique identifier for the response, format: resp_[alphanumeric]';
