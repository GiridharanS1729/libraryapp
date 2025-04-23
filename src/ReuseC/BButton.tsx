import { Button } from "react-bootstrap"

type BButtonProps = {
    variant: string
    onClick: () => void
    label: string
}

const BButton = ({ variant, onClick, label }: BButtonProps) => {
    return (
        <Button  className="det-btn" variant={variant} onClick={onClick}>
            {label}
        </Button>
    )
}

export default BButton
