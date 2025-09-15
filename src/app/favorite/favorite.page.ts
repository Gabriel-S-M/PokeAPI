import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { FavPoke } from '../model/fav-poke';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonButton, IonIcon, IonItem, IonLabel, IonInput, IonCardContent, IonButtons, IonCardSubtitle, IonCardTitle, IonCardHeader, IonCard, IonCol, IonRow, IonGrid, IonContent, IonTitle, IonBackButton, IonToolbar } from "@ionic/angular/standalone";
import { pencil, trash } from 'ionicons/icons';
import { addIcons } from 'ionicons';

addIcons({trash: trash, pencil: pencil})

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.page.html',
  styleUrls: ['./favorite.page.scss'],
  standalone: true,
  imports: [IonToolbar, IonBackButton, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonButtons, IonCardContent, CommonModule, FormsModule, IonHeader, IonButton, IonIcon, IonItem, IonLabel, IonInput]
})
export class FavoritePage implements OnInit {
  favorites: FavPoke[] = [];
  editIndex: number|null = null;
  editPokemon: FavPoke|null = null;
  showAlert = false;
  removeIndex: number|null = null;

  constructor(private alertCtrl: AlertController) {}

  ngOnInit() {
    this.loadFavorites();
  }

  loadFavorites() {
    const stored = localStorage.getItem('favorites');
    if (stored) {
      const raw = JSON.parse(stored);
      this.favorites = raw.map((p: any) => new FavPoke(p));
    } else {
      this.favorites = [];
    }
  }

  saveFavorites() {
    localStorage.setItem(
      'favorites',
      JSON.stringify(this.favorites.map(f => f.toJSON()))
    );
  }

  enableEdit(i: number) {
    this.editIndex = i;
    this.editPokemon = new FavPoke(this.favorites[i].toJSON());
  }

  cancelEdit() {
    this.editIndex = null;
    this.editPokemon = null;
  }

  saveEdit(i: number) {
    if (!this.editPokemon) return;
    this.favorites[i] = new FavPoke(this.editPokemon.toJSON());
    this.saveFavorites();
    this.cancelEdit();
  }

  async confirmRemove(index: number) {
    const alert = await this.alertCtrl.create({
      header: 'Remover Favorito',
      message: 'Deseja realmente remover este Pokémon dos favoritos?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Remover',
          role: 'destructive',
          handler: () => {
            const removedId = this.favorites[index]?.id;
            this.favorites.splice(index, 1);
            this.saveFavorites();
            // Dispara evento para HomePage
            if (removedId !== undefined) {
              window.dispatchEvent(new CustomEvent('favoriteRemoved', { detail: { id: removedId } }));
            }
          }
        }
      ]
    });
    await alert.present();
  }
}
