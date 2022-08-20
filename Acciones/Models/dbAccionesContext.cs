using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

#nullable disable

namespace Acciones.Models
{
    public partial class dbAccionesContext : DbContext
    {
        public dbAccionesContext()
        {
        }

        public dbAccionesContext(DbContextOptions<dbAccionesContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Apoyo> Apoyos { get; set; }
        public virtual DbSet<ArchivosBitacora> ArchivosBitacoras { get; set; }
        public virtual DbSet<ArchivosBitacoraGestion> ArchivosBitacorasGestion { get; set; }
        public virtual DbSet<ArchivosEvento> ArchivosEventos { get; set; }
        public virtual DbSet<ArchivosPeticione> ArchivosPeticiones { get; set; }
        public virtual DbSet<ArchivosGestiones> ArchivosGestiones { get; set; }
        public virtual DbSet<ArchivosVisita> ArchivosVisitas { get; set; }
        public virtual DbSet<ArchivosPublicidad> ArchivosPublicidad { get; set; }
        public virtual DbSet<AsistentesEvento> AsistentesEventos { get; set; }
        public virtual DbSet<Asociacione> Asociaciones { get; set; }
        public virtual DbSet<Beneficiario> Beneficiarios { get; set; }
        public virtual DbSet<BeneficiarioGestion> BeneficiariosGestion { get; set; }
        public virtual DbSet<Bitacora> Bitacoras { get; set; }
        public virtual DbSet<BitacoraGestion> BitacorasGestion { get; set; }
        public virtual DbSet<AutorExterno_iniciativa> AutorExterno_iniciativa { get; set; }
        public virtual DbSet<Calle> Calles { get; set; }
        public virtual DbSet<Categoria> Categorias { get; set; }
  
        public virtual DbSet<Ciudadano> Ciudadanos { get; set; }
        public virtual DbSet<Publicidad> Publicidad { get; set; }
        public virtual DbSet<Colonia> Colonias { get; set; }
        public virtual DbSet<Dependencia> Dependencias { get; set; }
        public virtual DbSet<Diputado> Diputados { get; set; }
        public virtual DbSet<EstatusPeticione> EstatusPeticiones { get; set; }
        public virtual DbSet<EstatusGestion> EstatusGestion { get; set; }
        public virtual DbSet<TiposEvento> TiposEvento { get; set; }
        public virtual DbSet<Municipios> Municipios { get; set; }
        public virtual DbSet<CatPartidos> CatPartidos { get; set; }
        public virtual DbSet<TipoPublicidad> TipoPublicidad { get; set; }
        public virtual DbSet<OrigenPublicidad> OrigenPublicidad { get; set; }
        public virtual DbSet<Evento> Eventos { get; set; }
        public virtual DbSet<IntegrantesAsociacion> IntegrantesAsociacions { get; set; }
        public virtual DbSet<Legislatura> Legislaturas { get; set; }
        public virtual DbSet<LugaresVisitado> LugaresVisitados { get; set; }
        public virtual DbSet<OrigenPeticione> OrigenPeticiones { get; set; }
        public virtual DbSet<PersonasVisitada> PersonasVisitadas { get; set; }
        public virtual DbSet<PeticionCategorium> PeticionCategoria { get; set; }
        public virtual DbSet<PeticionSubcategorium> PeticionSubcategoria { get; set; }
        public virtual DbSet<GestionCategoria> GestionCategoria { get; set; }
        public virtual DbSet<GestionSubcategoria> GestionSubcategoria { get; set; }
        public virtual DbSet<Peticione> Peticiones { get; set; }
        public virtual DbSet<Gestiones> Gestiones { get; set; }
        public virtual DbSet<Role> Roles { get; set; }
        public virtual DbSet<Subcategoria> Subcategorias { get; set; }
        public virtual DbSet<Usuario> Usuarios { get; set; }
        public virtual DbSet<Visita> Visitas { get; set; }


        public virtual DbSet<CatTipoIniciativa> CatTipoIniciativas { get; set; }
        public virtual DbSet<EstatusIniciativas> EstatusIniciativas { get; set; }
        public virtual DbSet<ArchivosIniciativas> ArchivosIniciativas { get; set; }
        public virtual DbSet<Comisiones> Comisiones { get; set; }
        public virtual DbSet<Iniciativas> Iniciativas { get; set; }
        public virtual DbSet<DiputadoIniciativa> DiputadoIniciativa { get; set; }
        public virtual DbSet<ComisionesXiniciativa> ComisionesXiniciativa { get; set; }
        

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                //optionsBuilder.UseSqlServer("Server=APPS-TEST;Database=dbAcciones;User Id=sa; Password=Sid123;");
                optionsBuilder.UseSqlServer("192.168.0.196;Database=dbAcciones;User Id=sa; Password=Sid123;");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasAnnotation("Relational:Collation", "Modern_Spanish_CI_AS");

            modelBuilder.Entity<Apoyo>(entity =>
            {
                entity.Property(e => e.ApoyoId).HasColumnName("ApoyoID");

                entity.Property(e => e.BeneficiarioId).HasColumnName("BeneficiarioID");

                entity.Property(e => e.CatalogoApoyosId).HasColumnName("CatalogoApoyosID");

                entity.Property(e => e.Descripcion)
                    .HasMaxLength(3000)
                    .IsUnicode(false);

                entity.Property(e => e.FechaRegistro).HasColumnType("datetime");

                entity.Property(e => e.FechaUltimoCambio).HasColumnType("datetime");

                entity.Property(e => e.PeticionId).HasColumnName("PeticionID");

                entity.HasOne(d => d.Beneficiario)
                    .WithMany(p => p.Apoyos)
                    .HasForeignKey(d => d.BeneficiarioId)
                    .HasConstraintName("FK_Apoyos_Beneficiarios");
            });


            modelBuilder.Entity<CatTipoIniciativa>(entity =>
            {
                entity.ToTable("CatTipoIniciativa");

                entity.Property(e => e.CatTipoIniciativaId).HasColumnName("CatTipoIniciativaID");

                entity.Property(e => e.Estatus).HasColumnName("estatus");

                entity.Property(e => e.FechaRegistro).HasColumnType("datetime");

                entity.Property(e => e.FechaUltimoCambio).HasColumnType("datetime");

                entity.Property(e => e.Nombre)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);
            });


            modelBuilder.Entity<EstatusIniciativas>(entity =>
            {
                entity.ToTable("EstatusIniciativas");

                entity.Property(e => e.EstatusIniciativasId).HasColumnName("EstatusIniciativasID");

                entity.Property(e => e.Estatus).HasColumnName("estatus");

                entity.Property(e => e.FechaRegistro).HasColumnType("datetime");

                entity.Property(e => e.FechaUltimoCambio).HasColumnType("datetime");

                entity.Property(e => e.Nombre)
                    .IsRequired()
                    .HasMaxLength(200)
                    .IsUnicode(false);
                
                entity.Property(e => e.Descripcion)
                    .HasMaxLength(1500)
                    .IsUnicode(false);
            });


            modelBuilder.Entity<ArchivosIniciativas>(entity =>
            {
                entity.HasKey(e => e.ArchivosIniciativaId)
                .HasName("PK_ArchivosIniciativas");

                entity.ToTable("ArchivosIniciativas");

                entity.Property(e => e.ArchivosIniciativaId).HasColumnName("ArchivosIniciativaID");

                entity.Property(e => e.IniciativaId).HasColumnName("IniciativaID");

                entity.Property(e => e.Estatus).HasColumnName("estatus");

                entity.Property(e => e.FechaRegistro).HasColumnType("datetime");

                entity.Property(e => e.FechaUltimoCambio).HasColumnType("datetime");

                entity.Property(e => e.NombreArchivo)
                    .IsRequired()
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.NombreArchivoBd)
                    .IsRequired()
                    .HasMaxLength(150)
                    .IsUnicode(false)
                    .HasColumnName("NombreArchivoBD");

                entity.Property(e => e.Nota)
                    .HasMaxLength(400)
                    .IsUnicode(false);

                entity.Property(e => e.Url)
                    .HasMaxLength(500)
                    .IsUnicode(false)
                    .HasColumnName("URL");

            });


            modelBuilder.Entity<Comisiones>(entity =>
            {
                entity.HasKey(e => e.ComisionId)
                    .HasName("PK_Comision");

                entity.Property(e => e.ComisionId).HasColumnName("ComisionID");

                entity.Property(e => e.Comentario)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.FechaRegistro).HasColumnType("datetime");

                entity.Property(e => e.FechaUltimoCambio).HasColumnType("datetime");

                entity.Property(e => e.LegislaturaId).HasColumnName("LegislaturaID");

                entity.Property(e => e.Nombre)
                    .IsRequired()
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.UsuarioregistroId).HasColumnName("UsuarioregistroID");

            });


            modelBuilder.Entity<Iniciativas>(entity =>
            {
                entity.HasKey(e => e.IniciativaId)
                .HasName("PK_Iniciativa");


                entity.Property(e => e.IniciativaId).HasColumnName("IniciativaID");

                entity.Property(e => e.EstatusIniciativaId).HasColumnName("EstatusIniciativaID");

                entity.Property(e => e.CatTipoIniciativaId).HasColumnName("CatTipoIniciativaID");
                
                entity.Property(e => e.PresidenteId).HasColumnName("PresidenteID");

                entity.Property(e => e.PromotorId).HasColumnName("PromotorID");

                entity.Property(e => e.Clasificacion)
                    .HasMaxLength(30)
                    .IsUnicode(false);

                entity.Property(e => e.DocumentoReferencia)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.FechaAprobabcionPleno).HasColumnType("datetime");

                entity.Property(e => e.FechaAprobacionComision).HasColumnType("datetime");

                entity.Property(e => e.FechaBaja).HasColumnType("datetime");

                entity.Property(e => e.FechaPublicacionSa)
                    .HasColumnType("datetime")
                    .HasColumnName("FechaPublicacionSA");

                entity.Property(e => e.FechaRecibido).HasColumnType("datetime");

                entity.Property(e => e.FechaRegistro).HasColumnType("datetime");

                entity.Property(e => e.FechaTurno).HasColumnType("datetime");

                entity.Property(e => e.FechaUltimoCambio).HasColumnType("datetime");

                entity.Property(e => e.LegislaturaId).HasColumnName("LegislaturaID");

                entity.Property(e => e.LinkReferencia)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.Notas)
                    .HasMaxLength(2000)
                    .IsUnicode(false);

                entity.Property(e => e.NumTurno)
                    .HasMaxLength(30)
                    .IsUnicode(false);

                entity.Property(e => e.Titulo)
                    .IsRequired()
                    .HasMaxLength(2500)
                    .IsUnicode(false);

            });



            modelBuilder.Entity<DiputadoIniciativa>(entity =>
            {
                entity.HasKey(e => e.DiputadoIniciativaId)
                    .HasName("PK_DiputadoIniciativa");

                entity.Property(e => e.DiputadoIniciativaId).HasColumnName("DiputadoIniciativaID");

                entity.Property(e => e.DiputadoId).HasColumnName("DiputadoID");

                entity.Property(e => e.IniciativaId).HasColumnName("IniciativaID");

                entity.Property(e => e.FechaRegistro).HasColumnType("datetime");

                entity.Property(e => e.FechaUltimoCambio).HasColumnType("datetime");

                entity.Property(e => e.UsuarioRegistro).HasColumnName("UsuarioRegistro");

            });


            modelBuilder.Entity<ComisionesXiniciativa>(entity =>
            {
                entity.HasKey(e => e.ComisionesXiniciativaId)
                    .HasName("PK_ComisionesXiniciativa");

                entity.Property(e => e.ComisionesXiniciativaId).HasColumnName("ComisionesXiniciativaID");

                entity.Property(e => e.IniciativaId).HasColumnName("IniciativaID");
                entity.Property(e => e.ComisionId).HasColumnName("ComisionID");

                entity.Property(e => e.FechaRegistro).HasColumnType("datetime");

                entity.Property(e => e.FechaUltimoCambio).HasColumnType("datetime");

                entity.Property(e => e.UsuarioRegistro).HasColumnName("UsuarioRegistro");

            });

            modelBuilder.Entity<ArchivosBitacora>(entity =>
            {
                entity.ToTable("ArchivosBitacora");

                entity.Property(e => e.ArchivosBitacoraId).HasColumnName("ArchivosBitacoraID");

                entity.Property(e => e.BitacoraId).HasColumnName("BitacoraID");

                entity.Property(e => e.Estatus).HasColumnName("estatus");

                entity.Property(e => e.FechaRegistro).HasColumnType("datetime");

                entity.Property(e => e.FechaUltimoCambio).HasColumnType("datetime");

                entity.Property(e => e.NombreArchivo)
                    .IsRequired()
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.NombreArchivoBd)
                    .IsRequired()
                    .HasMaxLength(150)
                    .IsUnicode(false)
                    .HasColumnName("NombreArchivoBD");

                entity.Property(e => e.Nota)
                    .HasMaxLength(400)
                    .IsUnicode(false);

                entity.Property(e => e.Url)
                    .HasMaxLength(500)
                    .IsUnicode(false)
                    .HasColumnName("URL");

                entity.HasOne(d => d.Bitacora)
                    .WithMany(p => p.ArchivosBitacoras)
                    .HasForeignKey(d => d.BitacoraId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ArchivosBitacora_Bitacora");
            });

            modelBuilder.Entity<ArchivosBitacoraGestion>(entity =>
            {
                entity.ToTable("ArchivosBitacoraGestion");

                entity.Property(e => e.ArchivosBitacoraGestionId).HasColumnName("ArchivosBitacoraGestionID");

                entity.Property(e => e.BitacoraGestionId).HasColumnName("BitacoraGestionID");

                entity.Property(e => e.Estatus).HasColumnName("estatus");

                entity.Property(e => e.FechaRegistro).HasColumnType("datetime");

                entity.Property(e => e.FechaUltimoCambio).HasColumnType("datetime");

                entity.Property(e => e.NombreArchivo)
                    .IsRequired()
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.NombreArchivoBd)
                    .IsRequired()
                    .HasMaxLength(150)
                    .IsUnicode(false)
                    .HasColumnName("NombreArchivoBD");

                entity.Property(e => e.Nota)
                    .HasMaxLength(400)
                    .IsUnicode(false);

                entity.Property(e => e.Url)
                    .HasMaxLength(500)
                    .IsUnicode(false)
                    .HasColumnName("URL");

                entity.HasOne(d => d.BitacoraGestion)
                    .WithMany(p => p.ArchivosBitacorasGestion)
                    .HasForeignKey(d => d.BitacoraGestionId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ArchivosBitacoraGestion_BitacoraGestion");
            });

            modelBuilder.Entity<ArchivosEvento>(entity =>
            {
                entity.HasKey(e => e.ArchivosEventosId);

                entity.Property(e => e.ArchivosEventosId).HasColumnName("ArchivosEventosID");

                entity.Property(e => e.Estatus).HasColumnName("estatus");

                entity.Property(e => e.EventoId).HasColumnName("EventoID");

                entity.Property(e => e.FechaRegistro).HasColumnType("datetime");

                entity.Property(e => e.FechaUltimoCambio).HasColumnType("datetime");

                entity.Property(e => e.NombreArchivo)
                    .IsRequired()
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.NombreArchivoBd)
                    .IsRequired()
                    .HasMaxLength(150)
                    .IsUnicode(false)
                    .HasColumnName("NombreArchivoBD");

                entity.Property(e => e.Nota)
                    .HasMaxLength(400)
                    .IsUnicode(false);

                entity.Property(e => e.Url)
                    .HasMaxLength(500)
                    .IsUnicode(false)
                    .HasColumnName("URL");

                entity.HasOne(d => d.Evento)
                    .WithMany(p => p.ArchivosEventos)
                    .HasForeignKey(d => d.EventoId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ArchivosEventos_Eventos");
            });

            modelBuilder.Entity<ArchivosPeticione>(entity =>
            {
                entity.HasKey(e => e.ArchivosPeticionesId);

                entity.Property(e => e.ArchivosPeticionesId).HasColumnName("ArchivosPeticionesID");

                entity.Property(e => e.Estatus).HasColumnName("estatus");

                entity.Property(e => e.FechaRegistro).HasColumnType("datetime");

                entity.Property(e => e.FechaUltimoCambio).HasColumnType("datetime");

                entity.Property(e => e.NombreArchivo)
                    .IsRequired()
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.NombreArchivoBd)
                    .IsRequired()
                    .HasMaxLength(150)
                    .IsUnicode(false)
                    .HasColumnName("NombreArchivoBD");

                entity.Property(e => e.Nota)
                    .HasMaxLength(400)
                    .IsUnicode(false);

                entity.Property(e => e.PeticionId).HasColumnName("PeticionID");

                entity.Property(e => e.Url)
                    .HasMaxLength(500)
                    .IsUnicode(false)
                    .HasColumnName("URL");

                entity.HasOne(d => d.Peticion)
                    .WithMany(p => p.ArchivosPeticiones)
                    .HasForeignKey(d => d.PeticionId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ArchivosPeticiones_Peticiones");
            });

            modelBuilder.Entity<ArchivosGestiones>(entity =>
            {
                entity.HasKey(e => e.ArchivosGestionesId);

                entity.Property(e => e.ArchivosGestionesId).HasColumnName("ArchivosGestionesID");

                entity.Property(e => e.Estatus).HasColumnName("estatus");

                entity.Property(e => e.FechaRegistro).HasColumnType("datetime");

                entity.Property(e => e.FechaUltimoCambio).HasColumnType("datetime");

                entity.Property(e => e.NombreArchivo)
                    .IsRequired()
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.NombreArchivoBd)
                    .IsRequired()
                    .HasMaxLength(150)
                    .IsUnicode(false)
                    .HasColumnName("NombreArchivoBD");

                entity.Property(e => e.Nota)
                    .HasMaxLength(400)
                    .IsUnicode(false);

                entity.Property(e => e.GestionId).HasColumnName("GestionID");

                entity.Property(e => e.Url)
                    .HasMaxLength(500)
                    .IsUnicode(false)
                    .HasColumnName("URL");

                entity.HasOne(d => d.Gestion)
                    .WithMany(p => p.ArchivosGestiones)
                    .HasForeignKey(d => d.GestionId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ArchivosGestiones_Gestiones");
            });

            modelBuilder.Entity<ArchivosVisita>(entity =>
            {
                entity.HasKey(e => e.ArchivosVisitasId);

                entity.Property(e => e.ArchivosVisitasId).HasColumnName("ArchivosVisitasID");

                entity.Property(e => e.Estatus).HasColumnName("estatus");

                entity.Property(e => e.FechaRegistro).HasColumnType("datetime");

                entity.Property(e => e.FechaUltimoCambio).HasColumnType("datetime");

                entity.Property(e => e.NombreArchivo)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.NombreArchivoBd)
                    .HasMaxLength(150)
                    .IsUnicode(false)
                    .HasColumnName("NombreArchivoBD");

                entity.Property(e => e.Nota)
                    .HasMaxLength(400)
                    .IsUnicode(false);

                entity.Property(e => e.Url)
                    .HasMaxLength(500)
                    .IsUnicode(false)
                    .HasColumnName("URL");

                entity.Property(e => e.VisitaId).HasColumnName("VisitaID");

                entity.HasOne(d => d.Visita)
                    .WithMany(p => p.ArchivosVisita)
                    .HasForeignKey(d => d.VisitaId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ArchivosVisitas_Visitas");
            });


            modelBuilder.Entity<ArchivosPublicidad>(entity =>
            {
                entity.ToTable("ArchivosPublicidad");

                entity.HasKey(e => e.ArchivosPublicidadId);

                entity.Property(e => e.ArchivosPublicidadId).HasColumnName("ArchivosPublicidadID");

                entity.Property(e => e.PublicidadId).HasColumnName("PublicidadID");
                entity.Property(e => e.CiudadanoId).HasColumnName("CiudadanoID");

                entity.Property(e => e.Estatus).HasColumnName("estatus");

                entity.Property(e => e.FechaRegistro).HasColumnType("datetime");

                entity.Property(e => e.FechaUltimoCambio).HasColumnType("datetime");

                entity.Property(e => e.NombreArchivo)
                    .IsRequired()
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.NombreArchivoBd)
                    .IsRequired()
                    .HasMaxLength(150)
                    .IsUnicode(false)
                    .HasColumnName("NombreArchivoBD");

                entity.Property(e => e.Nota)
                    .HasMaxLength(400)
                    .IsUnicode(false);

                entity.Property(e => e.Url)
                    .HasMaxLength(500)
                    .IsUnicode(false)
                    .HasColumnName("URL");

            });

            modelBuilder.Entity<AsistentesEvento>(entity =>
            {
                entity.ToTable("AsistentesEvento");

                entity.Property(e => e.AsistentesEventoId).HasColumnName("AsistentesEventoID");

                entity.Property(e => e.CiudadanoId).HasColumnName("CiudadanoID");

                entity.Property(e => e.Comentarios)
                    .HasMaxLength(1500)
                    .IsUnicode(false);

                entity.Property(e => e.Estatus).HasColumnName("estatus");

                entity.Property(e => e.EventoId).HasColumnName("EventoID");

                entity.Property(e => e.FechaRegistro).HasColumnType("datetime");

                entity.Property(e => e.FechaUltimoCambio).HasColumnType("datetime");

                entity.HasOne(d => d.Ciudadano)
                    .WithMany(p => p.AsistentesEventos)
                    .HasForeignKey(d => d.CiudadanoId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_AsistentesEvento_Ciudadanos");

                entity.HasOne(d => d.Evento)
                    .WithMany(p => p.AsistentesEventos)
                    .HasForeignKey(d => d.EventoId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_AsistentesEvento_Eventos");
            });

            modelBuilder.Entity<Asociacione>(entity =>
            {
                entity.HasKey(e => e.AsociacionId);

                entity.Property(e => e.AsociacionId).HasColumnName("AsociacionID");

                entity.Property(e => e.CalleId).HasColumnName("CalleID");

                entity.Property(e => e.Campo1)
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .HasColumnName("campo1");

                entity.Property(e => e.Campo2).HasColumnName("campo2");

                entity.Property(e => e.ColoniaId).HasColumnName("ColoniaID");

                entity.Property(e => e.Cp).HasColumnName("CP");
                entity.Property(e => e.DiputadoID).HasColumnName("DiputadoID");

                entity.Property(e => e.Descripcion)
                    .HasMaxLength(3000)
                    .IsUnicode(false);

                entity.Property(e => e.Distrito)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Email)
                    .HasMaxLength(500)
                    .IsUnicode(false)
                    .HasColumnName("email");

                entity.Property(e => e.FechaRegistro).HasColumnType("datetime");

                entity.Property(e => e.FechaUltimoCambio).HasColumnType("datetime");

                entity.Property(e => e.Latitud)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Longitud)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Nombre)
                    .HasMaxLength(500)
                    .IsUnicode(false);

                entity.Property(e => e.NumExterior)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.NumInterior)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Seccion)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Telefono)
                    .HasMaxLength(500)
                    .IsUnicode(false)
                    .HasColumnName("telefono");

                entity.Property(e => e.UsuarioRegistroId).HasColumnName("UsuarioRegistroID");

                entity.HasOne(d => d.Calle)
                    .WithMany(p => p.Asociaciones)
                    .HasForeignKey(d => d.CalleId)
                    .HasConstraintName("FK_Asociaciones_Calles");

                entity.HasOne(d => d.Colonia)
                    .WithMany(p => p.Asociaciones)
                    .HasForeignKey(d => d.ColoniaId)
                    .HasConstraintName("FK_Asociaciones_Colonias");
            });

            modelBuilder.Entity<Beneficiario>(entity =>
            {
                entity.HasKey(e => e.BeneficiariosId);

                entity.Property(e => e.BeneficiariosId).HasColumnName("BeneficiariosID");

                entity.Property(e => e.Campo1)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.CiudadanoId).HasColumnName("CiudadanoID");

                entity.Property(e => e.FechaRegistro).HasColumnType("datetime");

                entity.Property(e => e.FechaUltimoCambio).HasColumnType("datetime");

                entity.Property(e => e.Latitud)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Longitud)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Notas)
                    .HasMaxLength(3000)
                    .IsUnicode(false);

                entity.Property(e => e.PeticionId).HasColumnName("PeticionID");

                entity.HasOne(d => d.Ciudadano)
                    .WithMany(p => p.Beneficiarios)
                    .HasForeignKey(d => d.CiudadanoId)
                    .HasConstraintName("FK_Beneficiarios_Ciudadanos");

                entity.HasOne(d => d.Peticion)
                    .WithMany(p => p.Beneficiarios)
                    .HasForeignKey(d => d.PeticionId)
                    .HasConstraintName("FK_Beneficiarios_Peticiones");
            });


            modelBuilder.Entity<BeneficiarioGestion>(entity =>
            {
                entity.HasKey(e => e.BeneficiariosGestionId);

                entity.Property(e => e.BeneficiariosGestionId).HasColumnName("BeneficiariosGestionID");

                entity.Property(e => e.Campo1)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.CiudadanoId).HasColumnName("CiudadanoID");

                entity.Property(e => e.FechaRegistro).HasColumnType("datetime");

                entity.Property(e => e.FechaUltimoCambio).HasColumnType("datetime");

                entity.Property(e => e.Latitud)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Longitud)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Notas)
                    .HasMaxLength(3000)
                    .IsUnicode(false);

                entity.Property(e => e.GestionId).HasColumnName("GestionID");

                entity.HasOne(d => d.Ciudadano)
                    .WithMany(p => p.BeneficiariosGestion)
                    .HasForeignKey(d => d.CiudadanoId)
                    .HasConstraintName("FK_BeneficiariosGestion_Ciudadanos");

                entity.HasOne(d => d.Gestion)
                    .WithMany(p => p.BeneficiariosGestion)
                    .HasForeignKey(d => d.GestionId)
                    .HasConstraintName("FK_BeneficiariosGestion_Gestiones");
            });

            modelBuilder.Entity<Bitacora>(entity =>
            {
                entity.ToTable("Bitacora");

                entity.Property(e => e.BitacoraId).HasColumnName("BitacoraID");

                entity.Property(e => e.DependeciaId).HasColumnName("DependeciaID");

                entity.Property(e => e.Descripcion)
                    .HasMaxLength(3000)
                    .IsUnicode(false);

                entity.Property(e => e.FechaCompromiso).HasColumnType("datetime");

                entity.Property(e => e.FechaRegistro).HasColumnType("datetime");

                entity.Property(e => e.FechaConclusion).HasColumnType("datetime");

                entity.Property(e => e.FechaUltimoCambio).HasColumnType("datetime");

                entity.Property(e => e.Nota)
                    .HasMaxLength(3000)
                    .IsUnicode(false);

                entity.Property(e => e.PeticionId).HasColumnName("PeticionID");

                entity.Property(e => e.Responsable)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.ResponsableId).HasColumnName("ResponsableID");

                entity.HasOne(d => d.Dependecia)
                    .WithMany(p => p.Bitacoras)
                    .HasForeignKey(d => d.DependeciaId)
                    .HasConstraintName("FK_Bitacora_Dependencias");

                entity.HasOne(d => d.Peticion)
                    .WithMany(p => p.Bitacoras)
                    .HasForeignKey(d => d.PeticionId)
                    .HasConstraintName("FK_Bitacora_Peticiones");

                entity.HasOne(d => d.ResponsableNavigation)
                    .WithMany(p => p.Bitacoras)
                    .HasForeignKey(d => d.ResponsableId)
                    .HasConstraintName("FK_Bitacora_Usuarios");
            });



            modelBuilder.Entity<BitacoraGestion>(entity =>
            {
                entity.ToTable("BitacoraGestion");

                entity.Property(e => e.BitacoraGestionId).HasColumnName("BitacoraGestionID");

                entity.Property(e => e.DependeciaId).HasColumnName("DependeciaID");

                entity.Property(e => e.Descripcion)
                    .HasMaxLength(3000)
                    .IsUnicode(false);

                entity.Property(e => e.FechaCompromiso).HasColumnType("datetime");

                entity.Property(e => e.FechaRegistro).HasColumnType("datetime");

                entity.Property(e => e.FechaConclusion).HasColumnType("datetime");

                entity.Property(e => e.FechaUltimoCambio).HasColumnType("datetime");

                entity.Property(e => e.Nota)
                    .HasMaxLength(3000)
                    .IsUnicode(false);

                entity.Property(e => e.GestionId).HasColumnName("GestionID");

                entity.Property(e => e.Responsable)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.ResponsableId).HasColumnName("ResponsableID");

                entity.HasOne(d => d.Dependecia)
                    .WithMany(p => p.BitacorasGestion)
                    .HasForeignKey(d => d.DependeciaId)
                    .HasConstraintName("FK_BitacoraGestion_Dependencias");

                entity.HasOne(d => d.Gestion)
                    .WithMany(p => p.BitacorasGestion)
                    .HasForeignKey(d => d.GestionId)
                    .HasConstraintName("FK_BitacoraGestion_Gestiones");

                entity.HasOne(d => d.ResponsableNavigation)
                    .WithMany(p => p.BitacorasGestion)
                    .HasForeignKey(d => d.ResponsableId)
                    .HasConstraintName("FK_BitacoraGestion_Usuarios");
            });


            modelBuilder.Entity<AutorExterno_iniciativa>(entity =>
            {
                entity.ToTable("AutorExterno_iniciativa");

                entity.HasKey(e => e.AutorExterno_iniciativaID);
                
                entity.Property(e => e.AutorExterno_iniciativaID).HasColumnName("AutorExterno_iniciativaID");

                entity.Property(e => e.IniciativaID).HasColumnName("IniciativaID");

                entity.Property(e => e.InstitucionID).HasColumnName("InstitucionID");

                entity.Property(e => e.FechaRegistro).HasColumnType("datetime");

                entity.Property(e => e.FechaUltimoCambio).HasColumnType("datetime");
            });


            modelBuilder.Entity<Calle>(entity =>
            {
                entity.Property(e => e.CalleId).HasColumnName("CalleID");

                entity.Property(e => e.ColoniaId).HasColumnName("ColoniaID");

                entity.Property(e => e.Distrito)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Lote)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.Manzana)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.NombreCalle)
                    .IsRequired()
                    .HasMaxLength(500)
                    .IsUnicode(false);

                entity.Property(e => e.Seccion)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.HasOne(d => d.Colonia)
                    .WithMany(p => p.Calles)
                    .HasForeignKey(d => d.ColoniaId)
                    .HasConstraintName("FK_Calles_Colonias");
            });

            modelBuilder.Entity<Categoria>(entity =>
            {
                entity.Property(e => e.CategoriaId).HasColumnName("CategoriaID");

                entity.Property(e => e.Descripcion)
                    .HasMaxLength(2000)
                    .IsUnicode(false);

                entity.Property(e => e.FechaRegistro).HasColumnType("datetime");

                entity.Property(e => e.FechaUltimoCambio).HasColumnType("datetime");

                entity.Property(e => e.UsuarioRegistroId).HasColumnName("UsuarioRegistroID");
            });




            modelBuilder.Entity<Ciudadano>(entity =>
            {
                entity.Property(e => e.CiudadanoId).HasColumnName("CiudadanoID");

                entity.Property(e => e.CalleId).HasColumnName("CalleID");

                entity.Property(e => e.Campo1)
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .HasColumnName("campo1");

                entity.Property(e => e.Campo2).HasColumnName("campo2");
                entity.Property(e => e.NombreCompleto).HasColumnName("NombreCompleto");

                entity.Property(e => e.ColoniaId).HasColumnName("ColoniaID");

                entity.Property(e => e.Cp).HasColumnName("CP");

                entity.Property(e => e.recordarcumple).HasColumnName("recordarcumple");
                entity.Property(e => e.Afin).HasColumnName("Afin");
                entity.Property(e => e.RCasilla).HasColumnName("RCasilla");
                entity.Property(e => e.NoAfin).HasColumnName("NoAfin");

                entity.Property(e => e.DiputadoId).HasColumnName("DiputadoId");

                entity.Property(e => e.Distrito)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Email)
                    .HasMaxLength(500)
                    .IsUnicode(false)
                    .HasColumnName("email");

                entity.Property(e => e.FechaNacimiento).HasColumnType("datetime");

                entity.Property(e => e.FechaRegistro).HasColumnType("datetime");

                entity.Property(e => e.FechaUltimoCambio).HasColumnType("datetime");

                entity.Property(e => e.Genero)
                    .HasMaxLength(20)
                    .IsUnicode(false);

                entity.Property(e => e.Latitud)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Longitud)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Materno)
                    .HasMaxLength(80)
                    .IsUnicode(false);

                entity.Property(e => e.Nombre)
                    .HasMaxLength(150)
                    .IsUnicode(false);

                entity.Property(e => e.Notas)
                    .HasMaxLength(3000)
                    .IsUnicode(false);

                entity.Property(e => e.NumExterior)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.NumInterior)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Partido)
                    .HasMaxLength(80)
                    .IsUnicode(false);

                entity.Property(e => e.Paterno)
                    .HasMaxLength(80)
                    .IsUnicode(false);

                entity.Property(e => e.Seccion)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Telefono)
                    .HasMaxLength(500)
                    .IsUnicode(false)
                    .HasColumnName("telefono");

                entity.Property(e => e.RFC)
                    .HasMaxLength(20)
                    .IsUnicode(false)
                    .HasColumnName("RFC");

                entity.Property(e => e.NombreArchivoBD)
                    .HasMaxLength(150)
                    .IsUnicode(false)
                    .HasColumnName("NombreArchivoBD");

                entity.Property(e => e.URL)
                    .HasMaxLength(500)
                    .IsUnicode(false)
                    .HasColumnName("URL");


                entity.Property(e => e.TipoMiembro)
                    .HasMaxLength(80)
                    .IsUnicode(false);

                entity.Property(e => e.UsuarioRegistroId).HasColumnName("UsuarioRegistroID");

                entity.HasOne(d => d.Calle)
                    .WithMany(p => p.Ciudadanos)
                    .HasForeignKey(d => d.CalleId)
                    .HasConstraintName("FK_Ciudadanos_Calles");

                entity.HasOne(d => d.Colonia)
                    .WithMany(p => p.Ciudadanos)
                    .HasForeignKey(d => d.ColoniaId)
                    .HasConstraintName("FK_Ciudadanos_Colonias");
            });



            modelBuilder.Entity<Publicidad>(entity =>
            {
                entity.Property(e => e.PublicidadId).HasColumnName("PublicidadID");


                entity.Property(e => e.Folio)
                    .HasMaxLength(80)
                    .IsUnicode(false);

                entity.Property(e => e.Nombre)
                    .HasMaxLength(80)
                    .IsUnicode(false);

                entity.Property(e => e.Tamaño)
                    .HasMaxLength(3000)
                    .IsUnicode(false);

                entity.Property(e => e.Notas)
                    .HasMaxLength(80)
                    .IsUnicode(false);

                entity.Property(e => e.NumExterior)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.NumInterior)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Distrito)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Seccion)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Campo1)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.Latitud)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Longitud)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Responsable)
                    .HasMaxLength(1000)
                    .IsUnicode(false);

                entity.Property(e => e.FechaRegistro).HasColumnType("datetime");

                entity.Property(e => e.FechaUltimoCambio).HasColumnType("datetime");

                entity.Property(e => e.FechaInstalacion).HasColumnType("datetime");

                entity.Property(e => e.FechaRetiro).HasColumnType("datetime");

                entity.Property(e => e.CiudadanoId).HasColumnName("CiudadanoID");
                entity.Property(e => e.ColoniaId).HasColumnName("ColoniaID");
                entity.Property(e => e.CalleId).HasColumnName("CalleID");
                entity.Property(e => e.TipoPublicidadId).HasColumnName("TipoPublicidadID");
                entity.Property(e => e.OrigenId).HasColumnName("OrigenID");
                entity.Property(e => e.UsuarioRegistroId).HasColumnName("UsuarioRegistroID");

            });

            modelBuilder.Entity<Colonia>(entity =>
            {
                entity.Property(e => e.ColoniaId).HasColumnName("ColoniaID");

                entity.Property(e => e.Distrito)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.FechaRegistro).HasColumnType("datetime");

                entity.Property(e => e.FechaUltimoCambio).HasColumnType("datetime");

                entity.Property(e => e.NombreColonia)
                    .IsRequired()
                    .HasMaxLength(500)
                    .IsUnicode(false);

                entity.Property(e => e.Seccion)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.UsuarioRegistroId).HasColumnName("UsuarioRegistroID");
            });

            modelBuilder.Entity<Dependencia>(entity =>
            {
                entity.Property(e => e.DependenciaId).HasColumnName("DependenciaID");

                entity.Property(e => e.CalleId).HasColumnName("CalleID");

                entity.Property(e => e.Campo1)
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .HasColumnName("campo1");

                entity.Property(e => e.Campo2).HasColumnName("campo2");

                entity.Property(e => e.ColoniaId).HasColumnName("ColoniaID");

                entity.Property(e => e.Cp).HasColumnName("CP");

                entity.Property(e => e.Descripcion)
                    .HasMaxLength(3000)
                    .IsUnicode(false);

                entity.Property(e => e.Email)
                    .HasMaxLength(500)
                    .IsUnicode(false)
                    .HasColumnName("email");

                entity.Property(e => e.FechaRegistro).HasColumnType("datetime");

                entity.Property(e => e.FechaUltimoCambio).HasColumnType("datetime");

                entity.Property(e => e.Latitud)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Longitud)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.NombreContacto)
                    .HasMaxLength(5000)
                    .IsUnicode(false);

                entity.Property(e => e.NombreDependecia)
                    .HasMaxLength(2000)
                    .IsUnicode(false);

                entity.Property(e => e.NumExterior)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.NumInterior)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Telefono)
                    .HasMaxLength(500)
                    .IsUnicode(false)
                    .HasColumnName("telefono");

                entity.Property(e => e.UsuarioRegistroId).HasColumnName("UsuarioRegistroID");

                entity.HasOne(d => d.Calle)
                    .WithMany(p => p.Dependencia)
                    .HasForeignKey(d => d.CalleId)
                    .HasConstraintName("FK_Dependencias_Calles");

                entity.HasOne(d => d.Colonia)
                    .WithMany(p => p.Dependencia)
                    .HasForeignKey(d => d.ColoniaId)
                    .HasConstraintName("FK_Dependencias_Colonias");
            });

            modelBuilder.Entity<Diputado>(entity =>
            {
                entity.Property(e => e.DiputadoId).HasColumnName("DiputadoID");

                entity.Property(e => e.Estatus).HasColumnName("estatus");

                entity.Property(e => e.FechaRegistro).HasColumnType("datetime");

                entity.Property(e => e.FechaUltimoCambio).HasColumnType("datetime");

                entity.Property(e => e.LegislaturaId).HasColumnName("LegislaturaID");

                entity.Property(e => e.Materno)
                    .HasMaxLength(30)
                    .IsUnicode(false);

                entity.Property(e => e.Nombre)
                    .HasMaxLength(30)
                    .IsUnicode(false);

                entity.Property(e => e.Notas)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.PartidoId).HasColumnName("PartidoID");

                entity.Property(e => e.Paterno)
                    .HasMaxLength(30)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<EstatusPeticione>(entity =>
            {
                entity.HasKey(e => e.EstatusPeticionesId);

                entity.Property(e => e.EstatusPeticionesId).HasColumnName("EstatusPeticionesID");

                entity.Property(e => e.Descripcion)
                    .HasMaxLength(1500)
                    .IsUnicode(false);

                entity.Property(e => e.Estatus).HasColumnName("estatus");

                entity.Property(e => e.FechaRegistro).HasColumnType("datetime");

                entity.Property(e => e.FechaUltimoCambio).HasColumnType("datetime");

                entity.Property(e => e.Nombre)
                    .IsRequired()
                    .HasMaxLength(200)
                    .IsUnicode(false);
            });


            modelBuilder.Entity<EstatusGestion>(entity =>
            {
                entity.HasKey(e => e.EstatusGestionId);

                entity.Property(e => e.EstatusGestionId).HasColumnName("EstatusGestionID");

                entity.Property(e => e.Descripcion)
                    .HasMaxLength(1500)
                    .IsUnicode(false);

                entity.Property(e => e.Estatus).HasColumnName("estatus");

                entity.Property(e => e.FechaRegistro).HasColumnType("datetime");

                entity.Property(e => e.FechaUltimoCambio).HasColumnType("datetime");

                entity.Property(e => e.Nombre)
                    .IsRequired()
                    .HasMaxLength(200)
                    .IsUnicode(false);
            });


            modelBuilder.Entity<TiposEvento>(entity =>
            {
                entity.HasKey(e => e.TipoEventoId);

                entity.Property(e => e.TipoEventoId).HasColumnName("TipoEventoID");

                entity.Property(e => e.Nombre)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.Descripcion)
                    .HasMaxLength(1500)
                    .IsUnicode(false);

                entity.Property(e => e.Estatus).HasColumnName("Estatus");
                entity.Property(e => e.DiputadoId).HasColumnName("DiputadoID");

                entity.Property(e => e.FechaRegistro).HasColumnType("datetime");

                entity.Property(e => e.FechaUltimoCambio).HasColumnType("datetime");


            });

            modelBuilder.Entity<Municipios>(entity =>
            {
                entity.HasKey(e => e.MunicipioId);

                entity.Property(e => e.MunicipioId).HasColumnName("MunicipioID");

                entity.Property(e => e.Nombre)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.FechaRegistro).HasColumnType("datetime");

                entity.Property(e => e.FechaUltimoCambio).HasColumnType("datetime");


            });

            modelBuilder.Entity<CatPartidos>(entity =>
            {
                entity.HasKey(e => e.PartidoId);

                entity.Property(e => e.PartidoId).HasColumnName("PartidoID");

                entity.Property(e => e.Nombre)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.Logotipo)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.FechaRegistro).HasColumnType("datetime");

                entity.Property(e => e.FechaUltimoCambio).HasColumnType("datetime");


            });

            modelBuilder.Entity<TipoPublicidad>(entity =>
            {
                entity.HasKey(e => e.TipoPublicidadId);

                entity.Property(e => e.TipoPublicidadId).HasColumnName("TipoPublicidadID");

                entity.Property(e => e.Nombre)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.FechaRegistro).HasColumnType("datetime");

                entity.Property(e => e.FechaUltimoCambio).HasColumnType("datetime");
            });


            modelBuilder.Entity<OrigenPublicidad>(entity =>
            {
                entity.HasKey(e => e.OrigenPublicidadId);

                entity.Property(e => e.OrigenPublicidadId).HasColumnName("OrigenPublicidadID");

                entity.Property(e => e.Nombre)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.FechaRegistro).HasColumnType("datetime");

                entity.Property(e => e.FechaUltimoCambio).HasColumnType("datetime");
            });


            modelBuilder.Entity<Evento>(entity =>
            {
                entity.Property(e => e.EventoId).HasColumnName("EventoID");

                entity.Property(e => e.CalleId).HasColumnName("CalleID");

                entity.Property(e => e.Campo1)
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .HasColumnName("campo1");

                entity.Property(e => e.Campo2).HasColumnName("campo2");

                entity.Property(e => e.ColoniaId).HasColumnName("ColoniaID");

                entity.Property(e => e.Cp).HasColumnName("CP");

                entity.Property(e => e.Descripcion)
                    .HasMaxLength(3000)
                    .IsUnicode(false);

                entity.Property(e => e.DiputadoId).HasColumnName("DiputadoID");

                entity.Property(e => e.Distrito)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Fecha).HasColumnType("datetime");

                entity.Property(e => e.FechaRegistro).HasColumnType("datetime");

                entity.Property(e => e.FechaUltimoCambio).HasColumnType("datetime");

                entity.Property(e => e.Lugar)
                    .HasMaxLength(300)
                    .IsUnicode(false);

                entity.Property(e => e.HoraInicio).HasColumnType("timespan");

                entity.Property(e => e.Latitud)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.LegislaturaId).HasColumnName("LegislaturaID");

                entity.Property(e => e.Longitud)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.NumExterior)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.NumInterior)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Seccion)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Tipo)
                    .HasMaxLength(30)
                    .IsUnicode(false);

                entity.Property(e => e.Folio)
                    .HasMaxLength(20)
                    .IsUnicode(false);

                entity.HasOne(d => d.Calle)
                    .WithMany(p => p.Eventos)
                    .HasForeignKey(d => d.CalleId)
                    .HasConstraintName("FK_Eventos_Calles");

                entity.HasOne(d => d.Colonia)
                    .WithMany(p => p.Eventos)
                    .HasForeignKey(d => d.ColoniaId)
                    .HasConstraintName("FK_Eventos_Colonias");

                entity.HasOne(d => d.Diputado)
                    .WithMany(p => p.Eventos)
                    .HasForeignKey(d => d.DiputadoId)
                    .HasConstraintName("FK_Eventos_Diputados");

                entity.HasOne(d => d.Legislatura)
                    .WithMany(p => p.Eventos)
                    .HasForeignKey(d => d.LegislaturaId)
                    .HasConstraintName("FK_Eventos_Legislatura");
            });

            modelBuilder.Entity<IntegrantesAsociacion>(entity =>
            {
                entity.ToTable("IntegrantesAsociacion");

                entity.Property(e => e.IntegrantesAsociacionId).HasColumnName("IntegrantesAsociacionID");

                entity.Property(e => e.AsociacionId).HasColumnName("AsociacionID");

                entity.Property(e => e.CiudadanoId).HasColumnName("CiudadanoID");

                entity.Property(e => e.FechaRegistro).HasColumnType("datetime");

                entity.Property(e => e.FechaUltimoCambio).HasColumnType("datetime");

                entity.Property(e => e.Representante).HasColumnName("Representante");

                entity.Property(e => e.Notas)
                    .HasMaxLength(3000)
                    .IsUnicode(false);

                entity.Property(e => e.Puesto)
                    .HasMaxLength(500)
                    .IsUnicode(false);

                entity.Property(e => e.UsuarioRegistroId).HasColumnName("UsuarioRegistroID");

                entity.HasOne(d => d.Asociacion)
                    .WithMany(p => p.IntegrantesAsociacions)
                    .HasForeignKey(d => d.AsociacionId)
                    .HasConstraintName("FK_IntegrantesAsociacion_Asociaciones");

                entity.HasOne(d => d.Ciudadano)
                    .WithMany(p => p.IntegrantesAsociacions)
                    .HasForeignKey(d => d.CiudadanoId)
                    .HasConstraintName("FK_IntegrantesAsociacion_Ciudadanos");
            });

            modelBuilder.Entity<Legislatura>(entity =>
            {
                entity.ToTable("Legislatura");

                entity.Property(e => e.LegislaturaId).HasColumnName("LegislaturaID");

                entity.Property(e => e.Descripcion)
                    .HasMaxLength(1500)
                    .IsUnicode(false);

                entity.Property(e => e.Estatus).HasColumnName("estatus");

                entity.Property(e => e.FechaRegistro).HasColumnType("datetime");

                entity.Property(e => e.FechaUltimoCambio).HasColumnType("datetime");

                entity.Property(e => e.Nombre)
                    .IsRequired()
                    .HasMaxLength(200)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<LugaresVisitado>(entity =>
            {
                entity.HasKey(e => e.LugarVisitadoId);

                entity.Property(e => e.LugarVisitadoId).HasColumnName("LugarVisitadoID");

                entity.Property(e => e.CalleId).HasColumnName("CalleID");

                entity.Property(e => e.Campo1)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.ColoniaId).HasColumnName("ColoniaID");

                entity.Property(e => e.Cp).HasColumnName("CP");

                entity.Property(e => e.Distrito)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.FechaRegistro).HasColumnType("datetime");

                entity.Property(e => e.FechaUltimoCambio).HasColumnType("datetime");

                entity.Property(e => e.Latitud)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Longitud)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Notas)
                    .HasMaxLength(3000)
                    .IsUnicode(false);

                entity.Property(e => e.NumExterior)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.NumInterior)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Seccion)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.VisitaId).HasColumnName("VisitaID");

                entity.HasOne(d => d.Calle)
                    .WithMany(p => p.LugaresVisitados)
                    .HasForeignKey(d => d.CalleId)
                    .HasConstraintName("FK_LugaresVisitados_Calles");

                entity.HasOne(d => d.Colonia)
                    .WithMany(p => p.LugaresVisitados)
                    .HasForeignKey(d => d.ColoniaId)
                    .HasConstraintName("FK_LugaresVisitados_Colonias");

                entity.HasOne(d => d.Visita)
                    .WithMany(p => p.LugaresVisitados)
                    .HasForeignKey(d => d.VisitaId)
                    .HasConstraintName("FK_LugaresVisitados_Visitas");
            });

            modelBuilder.Entity<OrigenPeticione>(entity =>
            {
                entity.HasKey(e => e.OrigenPeticionesId);

                entity.Property(e => e.OrigenPeticionesId).HasColumnName("OrigenPeticionesID");

                entity.Property(e => e.Descripcion)
                    .HasMaxLength(1500)
                    .IsUnicode(false);

                entity.Property(e => e.Estatus).HasColumnName("estatus");

                entity.Property(e => e.FechaRegistro).HasColumnType("datetime");

                entity.Property(e => e.FechaUltimoCambio).HasColumnType("datetime");

                entity.Property(e => e.Nombre)
                    .IsRequired()
                    .HasMaxLength(200)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<PersonasVisitada>(entity =>
            {
                entity.HasKey(e => e.PersonaVisitadaId);

                entity.Property(e => e.PersonaVisitadaId).HasColumnName("PersonaVisitadaID");

                entity.Property(e => e.Campo1)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.CiudadanoId).HasColumnName("CiudadanoID");

                entity.Property(e => e.FechaRegistro).HasColumnType("datetime");

                entity.Property(e => e.FechaUltimoCambio).HasColumnType("datetime");

                entity.Property(e => e.Latitud)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Longitud)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Notas)
                    .HasMaxLength(3000)
                    .IsUnicode(false);

                entity.Property(e => e.VisitaId).HasColumnName("VisitaID");

                entity.HasOne(d => d.Ciudadano)
                    .WithMany(p => p.PersonasVisitada)
                    .HasForeignKey(d => d.CiudadanoId)
                    .HasConstraintName("FK_PersonasVisitadas_Ciudadanos");

                entity.HasOne(d => d.Visita)
                    .WithMany(p => p.PersonasVisitada)
                    .HasForeignKey(d => d.VisitaId)
                    .HasConstraintName("FK_PersonasVisitadas_Visitas");
            });

            modelBuilder.Entity<PeticionCategorium>(entity =>
            {
                entity.HasKey(e => e.PeticionCategoriaId);

                entity.Property(e => e.PeticionCategoriaId).HasColumnName("PeticionCategoriaID");

                entity.Property(e => e.CategoriaId).HasColumnName("CategoriaID");

                entity.Property(e => e.Descripcion)
                    .HasMaxLength(3000)
                    .IsUnicode(false);

                entity.Property(e => e.FechaRegistro).HasColumnType("datetime");

                entity.Property(e => e.FechaUltimoCambio).HasColumnType("datetime");

                entity.Property(e => e.PeticionId).HasColumnName("PeticionID");

                entity.HasOne(d => d.Categoria)
                    .WithMany(p => p.PeticionCategoria)
                    .HasForeignKey(d => d.CategoriaId)
                    .HasConstraintName("FK_PeticionCategoria_Categorias");

                entity.HasOne(d => d.Peticion)
                    .WithMany(p => p.PeticionCategoria)
                    .HasForeignKey(d => d.PeticionId)
                    .HasConstraintName("FK_PeticionCategoria_Peticiones");
            });


            modelBuilder.Entity<GestionCategoria>(entity =>
            {
                entity.HasKey(e => e.GestionCategoriaId);

                entity.Property(e => e.GestionCategoriaId).HasColumnName("GestionCategoriaID");

                entity.Property(e => e.CategoriaId).HasColumnName("CategoriaID");

                entity.Property(e => e.Descripcion)
                    .HasMaxLength(3000)
                    .IsUnicode(false);

                entity.Property(e => e.FechaRegistro).HasColumnType("datetime");

                entity.Property(e => e.FechaUltimoCambio).HasColumnType("datetime");

                entity.Property(e => e.GestionId).HasColumnName("GestionID");

                entity.HasOne(d => d.Categoria)
                    .WithMany(p => p.GestionCategoria)
                    .HasForeignKey(d => d.CategoriaId)
                    .HasConstraintName("FK_GestionCategoria_Categorias");

                entity.HasOne(d => d.Gestion)
                    .WithMany(p => p.GestionCategoria)
                    .HasForeignKey(d => d.GestionId)
                    .HasConstraintName("FK_GestionCategoria_Gestiones");
            });


            modelBuilder.Entity<PeticionSubcategorium>(entity =>
            {
                entity.HasKey(e => e.PeticionSubcategoriaId);

                entity.Property(e => e.PeticionSubcategoriaId).HasColumnName("PeticionSubcategoriaID");

                entity.Property(e => e.Descripcion)
                    .HasMaxLength(3000)
                    .IsUnicode(false);

                entity.Property(e => e.FechaRegistro).HasColumnType("datetime");

                entity.Property(e => e.FechaUltimoCambio).HasColumnType("datetime");

                entity.Property(e => e.PeticionCategoriaId).HasColumnName("PeticionCategoriaID");

                entity.Property(e => e.PeticionId).HasColumnName("PeticionID");

                entity.Property(e => e.SubcategoriaId).HasColumnName("SubcategoriaID");

                entity.HasOne(d => d.Peticion)
                    .WithMany(p => p.PeticionSubcategoria)
                    .HasForeignKey(d => d.PeticionId)
                    .HasConstraintName("FK_PeticionSubcategoria_Peticiones");

                entity.HasOne(d => d.Subcategoria)
                    .WithMany(p => p.PeticionSubcategoria)
                    .HasForeignKey(d => d.SubcategoriaId)
                    .HasConstraintName("FK_PeticionSubcategoria_Subcategorias");
            });


            modelBuilder.Entity<GestionSubcategoria>(entity =>
            {
                entity.HasKey(e => e.GestionSubcategoriaId);

                entity.Property(e => e.GestionSubcategoriaId).HasColumnName("GestionSubcategoriaID");

                entity.Property(e => e.Descripcion)
                    .HasMaxLength(3000)
                    .IsUnicode(false);

                entity.Property(e => e.FechaRegistro).HasColumnType("datetime");

                entity.Property(e => e.FechaUltimoCambio).HasColumnType("datetime");

                entity.Property(e => e.GestionCategoriaId).HasColumnName("GestionCategoriaID");

                entity.Property(e => e.GestionId).HasColumnName("GestionID");

                entity.Property(e => e.SubcategoriaId).HasColumnName("SubcategoriaID");

                entity.HasOne(d => d.Gestion)
                    .WithMany(p => p.GestionSubcategoria)
                    .HasForeignKey(d => d.GestionId)
                    .HasConstraintName("FK_GestionSubcategoria_Gestiones");

                entity.HasOne(d => d.Subcategoria)
                    .WithMany(g => g.GestionSubcategoria)
                    .HasForeignKey(d => d.SubcategoriaId)
                    .HasConstraintName("FK_GestionSubcategoria_Subcategorias");
            });


            modelBuilder.Entity<Peticione>(entity =>
            {
                entity.HasKey(e => e.PeticionId);

                entity.Property(e => e.PeticionId).HasColumnName("PeticionID");

                entity.Property(e => e.AsociacionId).HasColumnName("AsociacionID");

                entity.Property(e => e.Campo1)
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .HasColumnName("campo1");

                entity.Property(e => e.Campo2).HasColumnName("campo2");

                entity.Property(e => e.Costo).HasColumnName("Costo");

                entity.Property(e => e.SolicitanteId).HasColumnName("SolicitanteId");

                entity.Property(e => e.DependeciaId).HasColumnName("DependeciaID");

                entity.Property(e => e.Descripcion)
                    .HasMaxLength(3000)
                    .IsUnicode(false);

                entity.Property(e => e.DiputadoId).HasColumnName("DiputadoID");

                entity.Property(e => e.Distrito)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Folio)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.FechaCompromiso).HasColumnType("datetime");

                entity.Property(e => e.FechaConclusion).HasColumnType("datetime");

                entity.Property(e => e.FechaRegistro).HasColumnType("datetime");

                entity.Property(e => e.FechaSolicitud).HasColumnType("datetime");

                entity.Property(e => e.FechaUltimoCambio).HasColumnType("datetime");

                entity.Property(e => e.Costo).HasColumnType("float");
                entity.Property(e => e.ResponsableID).HasColumnName("ResponsableID");

                entity.Property(e => e.LegislaturaId).HasColumnName("LegislaturaID");

                entity.Property(e => e.OrigenPeticionId).HasColumnName("OrigenPeticionID");

                //entity.HasOne(d => d.Asociacion)
                //    .WithMany(p => p.Peticiones)
                //    .HasForeignKey(d => d.AsociacionId)
                //    .HasConstraintName("FK_Peticiones_Asociaciones");

                //entity.HasOne(d => d.Dependecia)
                //    .WithMany(p => p.Peticiones)
                //    .HasForeignKey(d => d.DependeciaId)
                //    .HasConstraintName("FK_Peticiones_Dependencias");

                entity.HasOne(d => d.Diputado)
                    .WithMany(p => p.Peticiones)
                    .HasForeignKey(d => d.DiputadoId)
                    .HasConstraintName("FK_Peticiones_Diputados");

                entity.HasOne(d => d.EstatusNavigation)
                    .WithMany(p => p.Peticiones)
                    .HasForeignKey(d => d.Estatus)
                    .HasConstraintName("FK_Peticiones_EstatusPeticiones");

                entity.HasOne(d => d.Legislatura)
                    .WithMany(p => p.Peticiones)
                    .HasForeignKey(d => d.LegislaturaId)
                    .HasConstraintName("FK_Peticiones_Legislatura");

                entity.HasOne(d => d.OrigenPeticion)
                    .WithMany(p => p.Peticiones)
                    .HasForeignKey(d => d.OrigenPeticionId)
                    .HasConstraintName("FK_Peticiones_OrigenPeticiones");
            });




            modelBuilder.Entity<Gestiones>(entity =>
            {
                entity.HasKey(e => e.GestionId);

                entity.Property(e => e.GestionId).HasColumnName("GestionID");

                entity.Property(e => e.AsociacionId).HasColumnName("AsociacionID");

                entity.Property(e => e.Campo1)
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .HasColumnName("campo1");

                entity.Property(e => e.Campo2).HasColumnName("campo2");

                entity.Property(e => e.Costo).HasColumnName("Costo");

                entity.Property(e => e.SolicitanteId).HasColumnName("SolicitanteId");

                entity.Property(e => e.DependeciaId).HasColumnName("DependeciaID");

                entity.Property(e => e.Descripcion)
                    .HasMaxLength(3000)
                    .IsUnicode(false);

                entity.Property(e => e.DiputadoId).HasColumnName("DiputadoID");

                entity.Property(e => e.Distrito)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Folio)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.FechaCompromiso).HasColumnType("datetime");

                entity.Property(e => e.FechaConclusion).HasColumnType("datetime");

                entity.Property(e => e.FechaRegistro).HasColumnType("datetime");

                entity.Property(e => e.FechaSolicitud).HasColumnType("datetime");

                entity.Property(e => e.FechaUltimoCambio).HasColumnType("datetime");

                entity.Property(e => e.Costo).HasColumnType("float");
                entity.Property(e => e.ResponsableID).HasColumnName("ResponsableID");

                entity.Property(e => e.LegislaturaId).HasColumnName("LegislaturaID");

                entity.Property(e => e.OrigenPeticionId).HasColumnName("OrigenPeticionID");

                //entity.HasOne(d => d.Asociacion)
                //    .WithMany(g => g.Gestiones)
                //    .HasForeignKey(d => d.AsociacionId)
                //    .HasConstraintName("FK_Gestiones_Asociaciones");

                //entity.HasOne(d => d.Dependecia)
                //    .WithMany(g => g.Gestiones)
                //    .HasForeignKey(d => d.DependeciaId)
                //    .HasConstraintName("FK_Gestiones_Dependencias");

                entity.HasOne(d => d.Diputado)
                    .WithMany(g => g.Gestiones)
                    .HasForeignKey(d => d.DiputadoId)
                    .HasConstraintName("FK_Gestiones_Diputados");

                entity.HasOne(d => d.EstatusNavigation)
                    .WithMany(g => g.Gestion)
                    .HasForeignKey(d => d.Estatus)
                    .HasConstraintName("FK_Gestiones_EstatusGestion");

                entity.HasOne(d => d.Legislatura)
                    .WithMany(g => g.Gestiones)
                    .HasForeignKey(d => d.LegislaturaId)
                    .HasConstraintName("FK_Gestiones_Legislatura");

                entity.HasOne(d => d.OrigenPeticion)
                    .WithMany(g => g.Gestiones)
                    .HasForeignKey(d => d.OrigenPeticionId)
                    .HasConstraintName("FK_Gestiones_OrigenPeticiones");
            });



            modelBuilder.Entity<Role>(entity =>
            {
                entity.HasKey(e => e.RolId);

                entity.Property(e => e.RolId).HasColumnName("RolID");

                entity.Property(e => e.Descripcion)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.Estatus).HasColumnName("estatus");

                entity.Property(e => e.Nombre)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<Subcategoria>(entity =>
            {
                entity.HasKey(e => e.SubcategoriasId);

                entity.Property(e => e.SubcategoriasId).HasColumnName("SubcategoriasID");

                entity.Property(e => e.CategoriaId).HasColumnName("CategoriaID");

                entity.Property(e => e.Descripcion)
                    .HasMaxLength(2000)
                    .IsUnicode(false);

                entity.Property(e => e.FechaRegistro).HasColumnType("datetime");

                entity.Property(e => e.FechaUltimoCambio).HasColumnType("datetime");

                entity.Property(e => e.UsuarioRegistroId).HasColumnName("UsuarioRegistroID");

                entity.HasOne(d => d.Categoria)
                    .WithMany(p => p.Subcategoria)
                    .HasForeignKey(d => d.CategoriaId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Subcategorias_Categorias");
            });


            

            modelBuilder.Entity<Usuario>(entity =>
            {
                entity.Property(e => e.UsuarioId).HasColumnName("UsuarioID");

                entity.Property(e => e.Clave)
                    .HasMaxLength(150)
                    .IsUnicode(false)
                    .HasColumnName("clave");

                entity.Property(e => e.Contrasena)
                    .HasMaxLength(150)
                    .IsUnicode(false)
                    .HasColumnName("contrasena");

                entity.Property(e => e.DiputadoId).HasColumnName("DiputadoID");

                entity.Property(e => e.Email)
                    .HasMaxLength(200)
                    .IsUnicode(false)
                    .HasColumnName("email");

                entity.Property(e => e.Estatus).HasColumnName("estatus");

                entity.Property(e => e.FechaRegistro).HasColumnType("datetime");

                entity.Property(e => e.FechaUltimoCambio).HasColumnType("datetime");

                entity.Property(e => e.Materno)
                    .HasMaxLength(80)
                    .IsUnicode(false);

                entity.Property(e => e.Nombre)
                    .HasMaxLength(150)
                    .IsUnicode(false);

                entity.Property(e => e.Paterno)
                    .HasMaxLength(80)
                    .IsUnicode(false);

                entity.Property(e => e.Puesto)
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.RolId).HasColumnName("RolID");

                entity.Property(e => e.Telefono)
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .HasColumnName("telefono");

                entity.Property(e => e.UsuarioRegistroId).HasColumnName("UsuarioRegistroID");

                entity.HasOne(d => d.Diputado)
                    .WithMany(p => p.Usuarios)
                    .HasForeignKey(d => d.DiputadoId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Usuarios_Diputados");

                entity.HasOne(d => d.Rol)
                    .WithMany(p => p.Usuarios)
                    .HasForeignKey(d => d.RolId)
                    .HasConstraintName("FK_Usuarios_Roles");
            });

            modelBuilder.Entity<Visita>(entity =>
            {
                entity.Property(e => e.VisitaId).HasColumnName("VisitaID");

                entity.Property(e => e.Campo1)
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .HasColumnName("campo1");

                entity.Property(e => e.Campo2).HasColumnName("campo2");

                entity.Property(e => e.Descripcion)
                    .HasMaxLength(5000)
                    .IsUnicode(false);

                entity.Property(e => e.DiputadoId).HasColumnName("DiputadoID");

                entity.Property(e => e.Distrito)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Fecha).HasColumnType("datetime");

                entity.Property(e => e.FechaRegistro).HasColumnType("datetime");

                entity.Property(e => e.FechaUltimoCambio).HasColumnType("datetime");

                entity.Property(e => e.LegislaturaId).HasColumnName("LegislaturaID");

                entity.Property(e => e.Seccion)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.HasOne(d => d.Diputado)
                    .WithMany(p => p.Visita)
                    .HasForeignKey(d => d.DiputadoId)
                    .HasConstraintName("FK_Visitas_Diputados");

                entity.HasOne(d => d.Legislatura)
                    .WithMany(p => p.Visita)
                    .HasForeignKey(d => d.LegislaturaId)
                    .HasConstraintName("FK_Visitas_Legislatura");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
