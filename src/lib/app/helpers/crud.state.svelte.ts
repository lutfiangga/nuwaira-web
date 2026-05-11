export class CrudState<T = any> {
    showCreate = $state(false);
    showEdit = $state(false);
    showSingle = $state(false);
    showDelete = $state(false);
    editItem = $state<T | null>(null);
    singleItem = $state<T | null>(null);
    deleteItem = $state<T | null>(null);
    linkToSingle = $state<string | null>(null);

    openCreate = () => {
        this.showCreate = true;
    };

    openEdit = (item: T) => {
        this.editItem = item;
        this.showEdit = true;
    };

    openSingle = (item: T, linkToSingle?: string) => {
        if (linkToSingle) {
            window.open(linkToSingle, '_blank');
            return;
        }
        this.singleItem = item;
        this.showSingle = true;
    };

    openDelete = (item: T) => {
        this.deleteItem = item;
        this.showDelete = true;
    };

    closeCreate = () => {
        this.showCreate = false;
    };

    closeEdit = () => {
        this.showEdit = false;
        this.editItem = null;
    };

    closeSingle = () => {
        this.showSingle = false;
        this.singleItem = null;
    };

    closeDelete = () => {
        this.showDelete = false;
        this.deleteItem = null;
    };
}
