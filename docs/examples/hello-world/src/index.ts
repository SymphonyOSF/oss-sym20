import { IExtension, IExtensionInit, IRegistry } from '@sym20/core';
import { IChatService } from '@sym20/core-chat';
import { IConversationStore } from '@sym20/core-conversations';
import { HelloWorldView } from './HelloWorldView';

export default class Extension implements IExtension {

    private chatService!: IChatService;
    private conversationStore!: IConversationStore;

    public async init(init: IExtensionInit, registry: IRegistry) {
        this.chatService = await registry.resolve(IChatService.TypeTag);
        this.conversationStore = await registry.resolve(IConversationStore.TypeTag);

        this.chatService.registerOverlayViewFactory(async (conversationId) => [new HelloWorldView(
            await this.conversationStore.getConversation(conversationId)),
        ]);
    }
}
