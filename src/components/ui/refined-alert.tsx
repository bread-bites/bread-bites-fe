import { VariantProps } from "class-variance-authority"
import { Alert, AlertDescription, AlertTitle, alertVariants } from "./alert"
import { AlertOctagonIcon, AlertTriangleIcon } from "lucide-react";
import clsx from "clsx";

type RefinedAlertProps = {
  variant: VariantProps<typeof alertVariants>['variant'],
  title?: string,
  children: string
}

export default function RefinedAlert(props: RefinedAlertProps) {
  const { variant, title, children: description } = props;
  return (
    <Alert className={clsx({
      'bg-destructive/10 text-destructive': variant === 'destructive',
      'bg-warning/10 text-warning': variant === 'warning'
    })}>
      {
        variant === 'destructive' && (<AlertOctagonIcon size={28}/>)
      }
      {
        variant === 'warning' && (<AlertTriangleIcon size={28}/>)
      }
      {title && <AlertTitle className="font-bold">{title}</AlertTitle>}
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  )
}
