import { ActivityType, Client } from 'discord.js';
import { DevelopmentLog } from '../../utils/dev.js';

/* Bot onReady Handler */
export default (Instance: Client<true>) => {
    const { user: { username, id } } = Instance
    DevelopmentLog(`${ username } [${ id }] is Online!`)

    /* Set Activity */
    Instance.user.setActivity({
        name: 'Over You!',
        type: ActivityType.Watching
    })
}
