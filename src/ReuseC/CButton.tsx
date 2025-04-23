
type CButtonProps = {
    clas: string
    label: string
}

const CButton = ({ clas, label }: CButtonProps) => {
    return (
        <span className={clas}>
            {label}
        </span>
    )
}

export default CButton;
