import PropTypes from 'prop-types';
import { TextField as MuiTextField, InputAdornment } from '@mui/material';
import './form-fields.css';
import './Input.css';

const WIDTH_VARIANT_TO_VALUE = {
  small: 100,
  medium: 200,
  large: 415,
  full: '100%',
};

function cx(...parts) {
  return parts.filter(Boolean).join(' ');
}

function hasInputValue(value) {
  return (
    value !== undefined &&
    value !== null &&
    (typeof value === 'number' || String(value).length > 0)
  );
}

function resolveFieldWidth({ width, widthVariant }) {
  if (width != null) return width;
  return WIDTH_VARIANT_TO_VALUE[widthVariant] ?? WIDTH_VARIANT_TO_VALUE.medium;
}

function resolveShrinkLabel({ shrinkProp, hasValue, label }) {
  return shrinkProp ?? (hasValue || Boolean(label));
}

function mergeInputSlotProps({ inputPropsProp, startAdornment, endAdornment }) {
  const merged = { ...(inputPropsProp ?? {}) };
  if (startAdornment) {
    merged.startAdornment = (
      <InputAdornment position="start">{startAdornment}</InputAdornment>
    );
  }
  if (endAdornment) {
    merged.endAdornment = (
      <InputAdornment position="end">{endAdornment}</InputAdornment>
    );
  }
  return Object.keys(merged).length > 0 ? merged : undefined;
}

/**
 * Campo de texto reutilizable (MUI TextField + estilos Orion UI).
 *
 * API estable y compatibilidad:
 * - `widthVariant` → ancho predefinido (`small` | `medium` | `large` | `full`)
 * - `long` → textarea de varias líneas
 * - `startAdornment` / `endAdornment` → iconos o prefijos en el campo
 * - `InputLabelProps` / `slotProps` → se fusionan sin perder control del label
 */
export function Input({
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
  className,
  inputClassName,
  sx,
  InputProps: inputPropsProp,
  InputLabelProps: inputLabelPropsProp,
  slotProps: slotPropsProp,
  ...rest
}) {
  const hasValue = hasInputValue(value);
  const fieldWidth = resolveFieldWidth({ width, widthVariant });
  const shouldShrinkLabel = resolveShrinkLabel({
    shrinkProp: inputLabelPropsProp?.shrink,
    hasValue,
    label,
  });
  const mergedInputProps = mergeInputSlotProps({
    inputPropsProp,
    startAdornment,
    endAdornment,
  });
  const isMultiline = long || multiline;

  const widthCss =
    typeof fieldWidth === 'number' ? `${fieldWidth}px` : fieldWidth;

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
      multiline={isMultiline}
      rows={long ? 2 : rows}
      maxRows={long ? undefined : maxRows}
      minRows={long ? undefined : minRows}
      className={cx('oui-field', 'oui-input', long && 'oui-input--long', className)}
      style={{ '--oui-input-width': widthCss }}
      slotProps={{
        ...slotPropsProp,
        inputLabel: {
          ...slotPropsProp?.inputLabel,
          ...inputLabelPropsProp,
          className: cx(
            'oui-input__label',
            slotPropsProp?.inputLabel?.className,
            inputLabelPropsProp?.className,
          ),
          shrink: shouldShrinkLabel,
        },
        input: {
          ...slotPropsProp?.input,
          ...mergedInputProps,
          className: cx(
            'oui-input__control',
            slotPropsProp?.input?.className,
            mergedInputProps?.className,
            inputClassName,
          ),
        },
      }}
      sx={{
        width: 'var(--oui-input-width)',
        ...sx,
      }}
      {...rest}
    />
  );
}

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
  className: PropTypes.string,
  inputClassName: PropTypes.string,
  sx: PropTypes.object,
  InputProps: PropTypes.object,
  InputLabelProps: PropTypes.object,
  slotProps: PropTypes.object,
};

export default Input;
