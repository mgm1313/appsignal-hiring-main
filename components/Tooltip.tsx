import Tippy, { type TippyProps, useSingleton } from '@tippyjs/react'
import { PropsWithChildren } from 'react'
import 'tippy.js/dist/tippy.css'

const Tooltip = ({
    content,
    children,
    ...rest
}: PropsWithChildren<{ content?: React.ReactNode } & TippyProps>) => {
    return (
        <Tippy
            placement="top"
            interactive={true}
            {...rest}
            content={
                <div className="ignore-react-onclickoutside">{content}</div>
            }
        >
            {children}
        </Tippy>
    )
}

export { useSingleton }

export default Tooltip
