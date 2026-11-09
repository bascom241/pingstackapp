import { Plus } from '../../../ui/icons'
import MessagingHeader from '../../messaging/MessagingHeader'

interface CampaignHeaderProps {
    isOpen: boolean
    setIsOpen: (value: boolean) => void
}

export default function CampaignHeader({ setIsOpen }: CampaignHeaderProps) {
    return <MessagingHeader eyebrow="Reach your audience" title="Campaigns" description="Thoughtful messages. Meaningful connections. Create, organize, and follow your email campaigns in one place." action={<button type="button" className="messaging-primary" onClick={() => setIsOpen(true)}><Plus size={20} /> Create campaign</button>} />
}
