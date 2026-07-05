import { TextField, InputAdornment, IconButton } from '@mui/material';
import { Search, Clear } from '@mui/icons-material';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onClear?: () => void;
}

export const SearchBar = ({
  value,
  onChange,
  placeholder = 'Search...',
  onClear,
}: SearchBarProps) => {
  return (
    <TextField
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      fullWidth
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
          endAdornment: value && onClear && (
            <InputAdornment position="end">
              <IconButton size="small" onClick={onClear}>
                <Clear />
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  );
};