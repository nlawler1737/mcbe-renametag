import { world, EntityInventoryComponent } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";

world.afterEvents.itemUse.subscribe(event => {
    const { itemStack, source } = event;
    if (!itemStack) return
    if (itemStack.typeId !== "minecraft:name_tag") return
    if (source.typeId !== "minecraft:player") return
    const selectedSlotIndex = source.selectedSlotIndex
    const inventory = source.getComponent("minecraft:inventory") as EntityInventoryComponent;
    const newNameTag = itemStack.clone();

    const form = new ModalFormData()
        .title("Rename Name Tag")
        .textField("", "(optional)", newNameTag.nameTag);

    form.show(source).then((response) => {
        if (response.canceled) return;
        const value = response.formValues[0] as string;
        newNameTag.nameTag = value;
        inventory.container.setItem(selectedSlotIndex, newNameTag);
    })
})