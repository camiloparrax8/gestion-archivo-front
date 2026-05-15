import PropTypes from 'prop-types';
import { TextField as MuiTextField, InputAdornment } from '@mui/material';

const Input = ({
  label,
  value,
  onChange,
  variant = 'outlined',
  size = 'medium',
  fullWidth = true,
  required = false,
  disabled = false,
  error = false,
  helperText,
  placeholder,
  type = 'text',
  multiline = false,
  rows = 1,
  maxRows,
  minRows,
  startAdornment,
  endAdornment,
  long = false,
  width,
  widthVariant = 'medium',
  sx,
  InputProps: InputPropsProp,
  slotProps: slotPropsProp,
  ...props
}) => {
  const mergedInputProps = {
    ...(InputPropsProp || {}),
  };
  if (startAdornment) {
    mergedInputProps.startAdornment = (
      <InputAdornment position="start">{startAdornment}</InputAdornment>
    );
  }
  if (endAdornment) {
    mergedInputProps.endAdornment = (
      <InputAdornment position="end">{endAdornment}</InputAdornment>
    );
  }

  const getWidth = () => {
    if (width) return width;
    if (widthVariant === 'full') return '100%';
    switch (widthVariant) {
      case 'small':
        return 100;
      case 'large':
        return 415;
      case 'medium':
      default:
        return 200;
    }
  };

  const currentWidth = getWidth();

  return (
    <MuiTextField
      label={label}
      value={value}
      onChange={onChange}
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      required={required}
      disabled={disabled}
      error={error}
      helperText={helperText}
      placeholder={placeholder}
      type={type}
      multiline={long ? true : multiline}
      rows={long ? 2 : rows}
      maxRows={long ? undefined : maxRows}
      minRows={long ? undefined : minRows}
      sx={{
        width: currentWidth,
        '& .MuiOutlinedInput-root': {
          backgroundColor: 'white',
        },
        ...(long && {
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'white',
            '& textarea': {
              resize: 'horizontal',
              minHeight: '24px',
              maxHeight: '96px',
              minWidth: '400px',
            },
          },
        }),
        ...sx,
      }}
      {...props}
      {...(Object.keys(mergedInputProps).length > 0 ? { InputProps: mergedInputProps } : {})}
      {...(slotPropsProp ? { slotProps: slotPropsProp } : {})}
    />
  );
};

Input.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  variant: PropTypes.oneOf(['outlined', 'filled', 'standard']),
  size: PropTypes.oneOf(['small', 'medium']),
  fullWidth: PropTypes.bool,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  multiline: PropTypes.bool,
  rows: PropTypes.number,
  maxRows: PropTypes.number,
  minRows: PropTypes.number,
  startAdornment: PropTypes.node,
  endAdornment: PropTypes.node,
  long: PropTypes.bool,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  widthVariant: PropTypes.oneOf(['small', 'medium', 'large', 'full']),
  sx: PropTypes.object,
  InputProps: PropTypes.object,
  slotProps: PropTypes.object,
};

export default Input;