import {
    Directive,
    DoCheck, EmbeddedViewRef, Input,
    OnChanges, SimpleChanges,
    TemplateRef, ViewContainerRef
} from '@angular/core';
import {RepeatContext} from './repeat.context';
import {isString} from 'util';

@Directive({selector: '[repeat]'})
export class RepeatDirective implements DoCheck, OnChanges {

    @Input()
    public repeat: any = 0;

    @Input('repeatStartIndex')
    public start_index: any = 1;

    @Input('repeatStep')
    public step: any = 1;

    constructor(private view_container: ViewContainerRef, private template_ref: TemplateRef<RepeatContext>) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if ('repeat' in changes) {
            const currentCount = changes['repeat'].currentValue;
            if (this.repeat !== currentCount) {
                this.repeat = currentCount;
                if (isString(this.repeat)) {
                    this.repeat = parseInt(this.repeat, 10);
                }
                this.applyChanges();
            }
        } else if ('start_index' in changes) {
            this.applyChanges();
        }
    }

    ngDoCheck(): void {
        this.applyChanges();
    }

    private applyChanges() {
        const item_length = this.view_container.length;

        if (isString(this.start_index)) {
            this.start_index = parseInt(this.start_index, 10);
        }

        if (item_length > this.repeat) {
            for (let currentIndex = this.repeat; currentIndex < item_length; currentIndex++) {
                this.view_container.remove(currentIndex);
            }
        } else if (this.repeat > item_length) {
            for (let currentIndex = item_length; currentIndex < this.repeat; currentIndex++) {
                this.view_container.createEmbeddedView(
                    this.template_ref,
                    new RepeatContext(0),
                    currentIndex);
            }
        }

        for (let i = 0, new_item_length = this.view_container.length; i < new_item_length; i++) {
            const viewRef = <EmbeddedViewRef<RepeatContext>>this.view_container.get(i);
            viewRef.context.index = i + this.start_index + (i * (this.step - 1));
        }
    }
}
