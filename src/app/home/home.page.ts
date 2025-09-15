import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { PokeService } from '../services/poke.service';
import { FavPoke } from '../model/fav-poke';
import { Router } from '@angular/router';
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
  offset = 0;
  limit = 30;
  clickedStars: { [id: number]: boolean } = {};


  constructor(private poke: PokeService, private router: Router) {
    addIcons({ star });
  }
  getFavorites(): FavPoke[] {
    const favs = localStorage.getItem('favorites');
    return favs ? JSON.parse(favs) : [];
  }

  toggleStar(id: number) {
    this.clickedStars[id] = !this.clickedStars[id];
  }

  isFavorite(pokemon: any): boolean {
    return this.getFavorites().some((f: any) => f.id === pokemon.id);
  }

  toggleFavorite(pokemon: any) {
    let favs = this.getFavorites();
    if (this.isFavorite(pokemon)) {
      favs = favs.filter((f: any) => f.id !== pokemon.id);
    } else {
      const fav = new FavPoke({
        id: pokemon.id,
        name: pokemon.name,
        image: pokemon.image,
        types: pokemon.types,
        abilities: pokemon.abilities,
        catchRate: pokemon.catchRate,
        height: pokemon.height,
        weight: pokemon.weight
      });
      favs.push(fav);
    }
    localStorage.setItem('favorites', JSON.stringify(favs));
  }

  goToFavorites() {
    this.router.navigate(['/favorite']);
  }


  async ngOnInit() {
    localStorage.removeItem('favorites');
    await this.loadPokemons();
    // Escuta evento de remoção de favorito
    window.addEventListener('favoriteRemoved', (e: any) => {
      const removedId = e.detail?.id;
      if (removedId !== undefined) {
        this.clickedStars[removedId] = false;
      }
    });
  }

  async loadPokemons() {
    this.loading = true;
    this.error = '';
    try {
      const list = await this.poke.getList(this.limit, this.offset);
      const promises = list.results.map((r: any) => this.poke.getPokemonDetails(r.url));
      const newPokemons = await Promise.all(promises);
      this.pokemons = [...this.pokemons, ...newPokemons];
      this.offset += this.limit;
    } catch (e) {
      console.error(e);
      this.error = 'Unable to load Pokemons';
    } finally {
      this.loading = false;
    }
  }

  async loadMore() {
    await this.loadPokemons();
  }

  heightMeters(h: number) {
    return (h / 10).toFixed(1);
  }

  weightKg(w: number) {
    return (w / 10).toFixed(1);
  }

  presentPopover(e: Event) {
    this.popover.event = e;
    this.isOpen = true;
  }

  selectPokemon(pokemon: any) {
    this.selectedPokemon = pokemon;
  }
}
