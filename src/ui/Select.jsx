import { useId, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import './ui-unique/form-fields.css';
import {
  Autocomplete,
  Box,
  Chip,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select as MuiSelect,
  TextField,
} from '@mui/material';

const Select = ({
  label,
  value,
  onChange,
  onInputChange,
  inputValue,
  options = [],
  fullWidth = true,
  required = false,
  disabled = false,
  error = false,
  helperText,
  size = 'medium',
  autocomplete = false,
  multiple = false,
  placeholder,
  limitTags = 3,
  width,
  widthVariant = 'medium',
  open,
  onOpen,
  onClose,
  disableCloseOnBlur,
  openOnFocus,
  sx,
  ...props
}) => {
  const justSelectedRef = useRef(false);
  const selectionTimeoutRef = useRef(null);
  const selectLabelId = useId();

  const selectedOptions = useMemo(() => {
    if (!multiple) return null;
    const normalizedValue = Array.isArray(value) ? value : [];
    return options.filter((opt) => normalizedValue.includes(opt.value));
  }, [options, value, multiple]);

  const handleMultipleChange = (_event, newValue) => {
    const next = Array.isArray(newValue) ? newValue.map((opt) => opt.value) : [];
    onChange?.({ target: { value: next } });
  };

  const getWidth = () => {
    if (widthVariant === 'full') return '100%';
    if (width) return width;
    switch (widthVariant) {
      case 'small':
        return 110;
      case 'large':
        return 400;
      case 'medium':
      default:
        return 200;
    }
  };

  const currentWidth = getWidth();
  const hasEmptyOption = options.some((opt) => opt.value === '' || opt.value == null);
  const shouldShrinkLabel =
    (value !== '' && value != null && value !== undefined) ||
    Boolean(placeholder) ||
    hasEmptyOption;

  const handleSingleChange = (event, newValue) => {
    if (autocomplete) {
      markJustSelected();
      onChange({ target: { value: newValue ? newValue.value : '' } });
    } else {
      onChange(event);
    }
  };

  const handleInputChange = (event, newInputValue, reason) => {
    if (onInputChange && reason === 'input') {
      onInputChange(newInputValue);
    }
  };

  const markJustSelected = () => {
    justSelectedRef.current = true;
    window.__selectJustSelected = true;

    if (selectionTimeoutRef.current) {
      clearTimeout(selectionTimeoutRef.current);
    }

    selectionTimeoutRef.current = setTimeout(() => {
      justSelectedRef.current = false;
      window.__selectJustSelected = false;
    }, 200);
  };

  const handleTextFieldKeyDown = (event) => {
    if (event.key === 'Enter' && open) {
      const autocompletePopper = document.querySelector('.MuiAutocomplete-popper');
      if (autocompletePopper) {
        const style = window.getComputedStyle(autocompletePopper);
        const isVisible =
          style.visibility !== 'hidden' &&
          style.display !== 'none' &&
          autocompletePopper.getAttribute('aria-hidden') !== 'true';

        if (isVisible && options.length > 0) {
          return;
        }
      }
    }
  };

  const handleListboxKeyDown = (event) => {
    if (event.key === 'Enter') {
      markJustSelected();
      event.stopPropagation();
    }
  };

  if (multiple) {
    return (
      <Box className="oui-field oui-select" sx={{ width: currentWidth }}>
        <Autocomplete
          multiple
          disableCloseOnSelect
          options={options}
          getOptionLabel={(option) => option.label}
          value={selectedOptions}
          onChange={handleMultipleChange}
          onInputChange={handleInputChange}
          fullWidth={fullWidth}
          disabled={disabled}
          limitTags={limitTags}
          disablePortal={false}
          ListboxProps={{
            style: {
              maxHeight: widthVariant === 'full' ? 'calc(100vh - 100px)' : 300,
            },
          }}
          slotProps={{
            popper: {
              sx: {
                zIndex: 9999,
              },
              placement: 'bottom-start',
            },
          }}
          renderTags={(tagValue, getTagProps) =>
            tagValue.map((option, index) => (
              <Chip
                {...getTagProps({ index })}
                key={option.value}
                label={option.label}
                size={size === 'small' ? 'small' : 'medium'}
              />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              className="oui-field oui-input"
              label={label}
              required={required}
              error={error}
              helperText={helperText}
              placeholder={placeholder}
              size={size}
              InputLabelProps={{
                ...params.InputLabelProps,
                shrink:
                  params.InputLabelProps?.shrink ??
                  (Boolean(placeholder) || (selectedOptions?.length ?? 0) > 0),
              }}
              sx={sx}
            />
          )}
          {...props}
        />
      </Box>
    );
  }

  return (
    <FormControl
      className="oui-field oui-select"
      fullWidth={fullWidth}
      required={required}
      disabled={disabled}
      error={error}
      size={size}
      sx={{
        width: currentWidth,
        ...sx,
      }}
    >
      {autocomplete ? (
        <Autocomplete
          options={options}
          getOptionLabel={(option) => option.label}
          value={options.find((opt) => opt.value === value) || null}
          inputValue={inputValue !== undefined ? inputValue : undefined}
          onChange={handleSingleChange}
          onInputChange={handleInputChange}
          open={open}
          onOpen={onOpen}
          onClose={onClose}
          disableCloseOnBlur={disableCloseOnBlur}
          openOnFocus={openOnFocus}
          disablePortal={false}
          ListboxProps={{
            style: {
              maxHeight: 300,
            },
            onKeyDown: handleListboxKeyDown,
          }}
          slotProps={{
            popper: {
              sx: {
                zIndex: 9999,
              },
              placement: 'bottom-start',
            },
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              className="oui-field oui-input"
              label={label}
              error={error}
              helperText={helperText}
              placeholder={placeholder}
              InputLabelProps={{
                ...params.InputLabelProps,
                shrink:
                  params.InputLabelProps?.shrink ??
                  (Boolean(placeholder) || (value !== '' && value != null)),
              }}
              onKeyDown={handleTextFieldKeyDown}
              sx={sx}
            />
          )}
          disabled={disabled}
          {...props}
        />
      ) : (
        <>
          {label ? (
            <InputLabel id={selectLabelId} htmlFor={selectLabelId} shrink={shouldShrinkLabel}>
              {label}
            </InputLabel>
          ) : null}
          <MuiSelect
            id={selectLabelId}
            labelId={selectLabelId}
            displayEmpty
            value={value ?? ''}
            onChange={onChange}
            label={label}
            renderValue={(selected) => {
              const option = options.find((opt) => opt.value === selected);
              const text = option?.label ?? (selected != null ? String(selected) : '');
              const isPlaceholder = selected === '' || selected == null;
              return (
                <Box
                  component="span"
                  sx={{
                    display: 'block',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    color: isPlaceholder ? 'text.secondary' : 'text.primary',
                  }}
                >
                  {text}
                </Box>
              );
            }}
            sx={sx}
            MenuProps={{
              disablePortal: false,
              PaperProps: {
                sx: {
                  zIndex: 9999,
                  maxHeight: widthVariant === 'full' ? 'calc(100vh - 100px)' : 300,
                },
              },
              anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'left',
              },
              transformOrigin: {
                vertical: 'top',
                horizontal: 'left',
              },
              getContentAnchorEl: null,
            }}
            {...props}
          >
            {options.map((option) => (
              <MenuItem key={String(option.value)} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </MuiSelect>
          {helperText ? <FormHelperText>{helperText}</FormHelperText> : null}
        </>
      )}
    </FormControl>
  );
};

Select.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
  ]),
  onChange: PropTypes.func,
  onInputChange: PropTypes.func,
  inputValue: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired,
    }),
  ),
  fullWidth: PropTypes.bool,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium']),
  autocomplete: PropTypes.bool,
  multiple: PropTypes.bool,
  placeholder: PropTypes.string,
  limitTags: PropTypes.number,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  widthVariant: PropTypes.oneOf(['small', 'medium', 'large', 'full']),
  open: PropTypes.bool,
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
  disableCloseOnBlur: PropTypes.bool,
  openOnFocus: PropTypes.bool,
  sx: PropTypes.object,
};

export default Select;
