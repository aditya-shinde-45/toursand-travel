import Input from '../common/Input';

interface DateTimePickerProps {
  dateLabel: string;
  timeLabel: string;
  minDate?: string;
  dateValue: string;
  timeValue: string;
  onDateChange: (value: string) => void;
  onTimeChange: (value: string) => void;
  dateError?: string;
  timeError?: string;
}

function DateTimePicker({
  dateLabel,
  timeLabel,
  minDate,
  dateValue,
  timeValue,
  onDateChange,
  onTimeChange,
  dateError,
  timeError,
}: DateTimePickerProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Input
        type="date"
        label={dateLabel}
        min={minDate}
        value={dateValue}
        onChange={(event) => onDateChange(event.target.value)}
        error={dateError}
      />
      <Input
        type="time"
        label={timeLabel}
        value={timeValue}
        onChange={(event) => onTimeChange(event.target.value)}
        error={timeError}
      />
    </div>
  );
}

export default DateTimePicker;
