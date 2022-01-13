using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

#nullable disable

namespace Acciones.Models
{
    public partial class Ciudadano
    {
        public Ciudadano()
        {
            AsistentesEventos = new HashSet<AsistentesEvento>();
            Beneficiarios = new HashSet<Beneficiario>();
            IntegrantesAsociacions = new HashSet<IntegrantesAsociacion>();
            PersonasVisitada = new HashSet<PersonasVisitada>();
        }

        public int CiudadanoId { get; set; }
        public string Paterno { get; set; }
        public string Materno { get; set; }
        public string Nombre { get; set; }
        public string NombreCompleto { get; set; }
        public int? ColoniaId { get; set; }
        public int? CalleId { get; set; }
        public string NumExterior { get; set; }
        public string NumInterior { get; set; }
        public int? Cp { get; set; }
        public string Email { get; set; }
        public string Telefono { get; set; }
        public string Partido { get; set; }
        public string TipoMiembro { get; set; }
        public string Distrito { get; set; }
        public string Seccion { get; set; }
        [DataType(DataType.Date)] 
        public DateTime? FechaNacimiento { get; set; }
        public int? Estatus { get; set; }
        public string Genero { get; set; }
        public string Notas { get; set; }
        public string Campo1 { get; set; }
        public int? Campo2 { get; set; }
        public string Latitud { get; set; }
        public string Longitud { get; set; }
        public DateTime? FechaRegistro { get; set; }
        public DateTime? FechaUltimoCambio { get; set; }
        public int? UsuarioRegistroId { get; set; }

        public virtual Calle Calle { get; set; }
        public virtual Colonia Colonia { get; set; }
        public virtual ICollection<AsistentesEvento> AsistentesEventos { get; set; }
        public virtual ICollection<Beneficiario> Beneficiarios { get; set; }
        public virtual ICollection<IntegrantesAsociacion> IntegrantesAsociacions { get; set; }
        public virtual ICollection<PersonasVisitada> PersonasVisitada { get; set; }
    }
}
