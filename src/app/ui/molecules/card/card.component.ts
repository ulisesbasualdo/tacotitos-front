import { Component, computed, input } from '@angular/core';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
@Component({
  selector: 'app-card, ui-card',
  imports: [],
  template: `
    <div
      class="card"
      [class.new-card]="isNewCard()"
      [class.width-100]="hasWidth100()"
      [class.mt-3]="_hasMarginTop()">
      <div class="card-header">
        @if (titleText()) {
          <h2 class="title">{{ superTitle() }}</h2>
        }
        @if (subtitle()) {
          <p>{{ subtitle() }}</p>
        }
        @if (subtitleWarning()) {
          <p>{{ subtitleWarning() }}</p>
        }
      </div>
      <div class="card-body">
        <ng-content select="[cardBody]"></ng-content>
      </div>
      <ng-content select="[dataView]"></ng-content>
      <div class="card-footer">
        <ng-content select="[cardFooter]"></ng-content>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: contents;
    }

    .card {
      border-radius: 12px;
      -webkit-box-shadow: 0px 0px 45px 26px rgba(0, 0, 0, 0.09);
      -moz-box-shadow: 0px 0px 45px 26px rgba(0, 0, 0, 0.09);
      box-shadow: 0 0 45px 26px rgba(0, 0, 0, 0.0901960784);
      padding: 2em;
      width: calc(33.333% - 2em);
      min-width: 300px;
      box-sizing: border-box;
      // margin: 0;
      flex: 1 1 calc(33.333% - 2em);

      .card-header {
        .title {
          font-weight: bold;
          line-height: 1em;
        }
      }
      .card-body {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: pre-wrap;
        padding: 24px;
      }
      .card-footer {
        background-color: #ffffff44;
      }
      span.new {
        color: green;
      }
      a {
        display: inline-block;
      }
    }

    .card > * {
      padding-block: 0.5em;
    }

    .new-card {
      border: 0.25em solid green;
    }

    .width-100 {
      width: 100%;
    }

    @media (max-width: 768px) {
      :host {
        flex: 1 1 calc(100% - 2em);
      }
      .card {
        width: calc(100% - 2em);
        flex: 1 1 calc(100% - 2em);
        padding-inline: 1.5rem;
      }
    }

    @media (max-width: 480px) {
      :host {
        flex: 1 1 calc(100% - 2em);
      }
      .card {
        width: calc(100% - 2em);
        flex: 1 1 calc(100% - 2em);
      }
    }
  `,
})
export class CardComponent {
  public titleText = input<string>();
  public superTitle = computed(() => this.titleText()?.toLocaleUpperCase());
  public isNewCard = input<boolean>();
  public subtitle = input<string>();
  public subtitleWarning = input<string>();

  public width100 = input<BooleanInput>(false);
  protected hasWidth100 = computed(() =>
    coerceBooleanProperty(this.width100())
  );

  public hasMarginTop = input<BooleanInput>(false);
  protected _hasMarginTop = computed(() =>
    coerceBooleanProperty(this.hasMarginTop())
  );
}
