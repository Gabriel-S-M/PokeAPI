import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PokeService {
  private base = 'https://pokeapi.co/api/v2';

  constructor(private http: HttpClient) {}

  async getList(limit = 20, offset = 0) {
    const url = `${this.base}/pokemon?limit=${limit}&offset=${offset}`;
    return lastValueFrom(this.http.get<any>(url));
  }

  async getPokemonDetails(urlOrName: string) {
    const url = urlOrName.startsWith('http') ? urlOrName : `${this.base}/pokemon/${urlOrName}`;
    const pokemon = await lastValueFrom(this.http.get<any>(url));
    const species = await lastValueFrom(this.http.get<any>(pokemon.species.url));

    return {
      id: pokemon.id,
      name: pokemon.name,
      image:
        pokemon.sprites.other?.['official-artwork']?.front_default ??
        pokemon.sprites.front_default,
      types: pokemon.types.map((t: any) => t.type.name),
      abilities: pokemon.abilities.map((a: any) => a.ability.name),
      height: pokemon.height,
      weight: pokemon.weight,
      catchRate: species.capture_rate
    };
  }
}
