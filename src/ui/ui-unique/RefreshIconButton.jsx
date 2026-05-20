import PropTypes from 'prop-types';
import './RefreshIconButton.css';

function cx(...parts) {
  return parts.filter(Boolean).join(' ');
}

function RefreshIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M23 4v6h-6M1 20v-6h6" strokeLinecap="round" />
      <path
        d="M3.51 9a9 9 0 0114.13-3.36L23 10M1 14l5.36 4.36A9 9 0 0020.49 15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function RefreshIconButton({
  loading = false,
  disabled = false,
  onClick,
  label = 'Actualizar lista',
  title,
  variant = 'accent',
}) {
  const isDisabled = disabled || loading;

  return (
    <button
      type="button"
      className={cx(
        'icon-btn',
        'icon-btn--ghost',
        variant === 'accent' && 'icon-btn--accent',
        loading && 'icon-btn--spinning',
      )}
      disabled={isDisabled}
      onClick={onClick}
      aria-label={label}
      aria-busy={loading}
      title={title ?? label}
    >
      <RefreshIcon />
    </button>
  );
}

RefreshIconButton.propTypes = {
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  label: PropTypes.string,
  title: PropTypes.string,
  variant: PropTypes.oneOf(['accent', 'ghost']),
};

export default RefreshIconButton;
