import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { PokeService } from '../services/poke.service';
import { addIcons } from 'ionicons';
import { star } from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonicModule, CommonModule, FormsModule],
})
export class HomePage implements OnInit {
  @ViewChild('popover') popover!: HTMLIonPopoverElement;
  pokemons: any[] = [];
  loading = true;
  error = '';
  isOpen = false;
  selectedPokemon: any = null;

  constructor(private poke: PokeService) {
    addIcons({ star });
  }

  async ngOnInit() {
    await this.loadPokemons();
  }

  async loadPokemons() {
    this.loading = true;
    this.error = '';
    try {
      const list = await this.poke.getList(30); // adjust limit as needed
      const promises = list.results.map((r: any) => this.poke.getPokemonDetails(r.url));
      this.pokemons = await Promise.all(promises);
    } catch (e) {
      console.error(e);
      this.error = 'Unable to load Pokemons';
    } finally {
      this.loading = false;
    }
  }

  heightMeters(h: number) {
    return (h / 10).toFixed(1); // decimeters -> meters
  }

  weightKg(w: number) {
    return (w / 10).toFixed(1); // hectograms -> kg
  }

  presentPopover(e: Event) {
    this.popover.event = e;
    this.isOpen = true;
  }

  selectPokemon(pokemon: any) {
    this.selectedPokemon = pokemon;
  }
}
