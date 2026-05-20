import { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from '@mui/material';
import { Check, ContentCopy } from '@mui/icons-material';
import './CopyIconButton.css';

const ICON_SIZE = {
  small: 'small',
  medium: 'medium',
  large: 'large',
};

export function CopyIconButton({
  text,
  disabled = false,
  label = 'Copiar',
  copiedLabel = 'Copiado',
  size = 'small',
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    const value = text != null ? String(text).trim() : '';
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [text]);

  const canCopy = Boolean(text != null && String(text).trim());
  const isDisabled = disabled || !canCopy;
  const iconSize = ICON_SIZE[size] ?? ICON_SIZE.small;

  const onActivate = () => {
    if (isDisabled) return;
    void handleCopy();
  };

  const onKeyDown = (event) => {
    if (isDisabled) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      void handleCopy();
    }
  };

  return (
    <Tooltip title={copied ? copiedLabel : label}>
      <span
        role="button"
        tabIndex={isDisabled ? -1 : 0}
        aria-label={label}
        aria-disabled={isDisabled}
        className="copy-icon-action"
        onClick={onActivate}
        onKeyDown={onKeyDown}
      >
        {copied ? (
          <Check fontSize={iconSize} className="copy-icon-action__icon" />
        ) : (
          <ContentCopy fontSize={iconSize} className="copy-icon-action__icon" />
        )}
      </span>
    </Tooltip>
  );
}

CopyIconButton.propTypes = {
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  disabled: PropTypes.bool,
  label: PropTypes.string,
  copiedLabel: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
};

export default CopyIconButton;
