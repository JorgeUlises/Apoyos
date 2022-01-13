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
        public virtual DbSet<ArchivosEvento> ArchivosEventos { get; set; }
        public virtual DbSet<ArchivosPeticione> ArchivosPeticiones { get; set; }
        public virtual DbSet<ArchivosVisita> ArchivosVisitas { get; set; }
        public virtual DbSet<AsistentesEvento> AsistentesEventos { get; set; }
        public virtual DbSet<Asociacione> Asociaciones { get; set; }
        public virtual DbSet<Beneficiario> Beneficiarios { get; set; }
        public virtual DbSet<Bitacora> Bitacoras { get; set; }
        public virtual DbSet<Calle> Calles { get; set; }
        public virtual DbSet<Categoria> Categorias { get; set; }
        public virtual DbSet<Ciudadano> Ciudadanos { get; set; }
        public virtual DbSet<Colonia> Colonias { get; set; }
        public virtual DbSet<Dependencia> Dependencias { get; set; }
        public virtual DbSet<Diputado> Diputados { get; set; }
        public virtual DbSet<EstatusPeticione> EstatusPeticiones { get; set; }
        public virtual DbSet<Evento> Eventos { get; set; }
        public virtual DbSet<IntegrantesAsociacion> IntegrantesAsociacions { get; set; }
        public virtual DbSet<Legislatura> Legislaturas { get; set; }
        public virtual DbSet<LugaresVisitado> LugaresVisitados { get; set; }
        public virtual DbSet<OrigenPeticione> OrigenPeticiones { get; set; }
        public virtual DbSet<PersonasVisitada> PersonasVisitadas { get; set; }
        public virtual DbSet<PeticionCategorium> PeticionCategoria { get; set; }
        public virtual DbSet<PeticionSubcategorium> PeticionSubcategoria { get; set; }
        public virtual DbSet<Peticione> Peticiones { get; set; }
        public virtual DbSet<Role> Roles { get; set; }
        public virtual DbSet<Subcategoria> Subcategorias { get; set; }
        public virtual DbSet<Usuario> Usuarios { get; set; }
        public virtual DbSet<Visita> Visitas { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
                optionsBuilder.UseSqlServer("Server=10.11.10.150;Database=dbAcciones;User Id=sa; Password=Sid123;");
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

                entity.Property(e => e.LegislaturaId).HasColumnName("LegislaturaID");

                entity.Property(e => e.OrigenPeticionId).HasColumnName("OrigenPeticionID");

                entity.HasOne(d => d.Asociacion)
                    .WithMany(p => p.Peticiones)
                    .HasForeignKey(d => d.AsociacionId)
                    .HasConstraintName("FK_Peticiones_Asociaciones");

                entity.HasOne(d => d.Dependecia)
                    .WithMany(p => p.Peticiones)
                    .HasForeignKey(d => d.DependeciaId)
                    .HasConstraintName("FK_Peticiones_Dependencias");

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
