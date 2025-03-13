interface ToggleProps {
  checked: boolean;
  onChange: () => void;
  label: string;
  id: string;
  textColor?: string;
}

export default function Toggle({ 
  checked, 
  onChange, 
  label, 
  id,
  textColor = '#374151'
}: ToggleProps) {
  return (
    <div className="flex items-center">
      <input 
        id={id}
        type="checkbox" 
        checked={checked} 
        onChange={onChange}
        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
      />
      <label htmlFor={id} className="ml-2 text-sm" style={{ color: textColor }}>
        {label}
      </label>
    </div>
  );
}